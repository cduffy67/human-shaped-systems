// Server-only OAuth token store: read, refresh and save tokens. Never exposed to the browser.
export type Provider = "strava" | "spotify";

type TokenRow = {
  provider: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  scope: string | null;
};

const REFRESH_SKEW_MS = 5 * 60 * 1000;

async function db() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function load(provider: Provider): Promise<TokenRow | null> {
  const { data, error } = await (await db())
    .from("oauth_tokens")
    .select("provider, access_token, refresh_token, expires_at, scope")
    .eq("provider", provider)
    .maybeSingle();
  if (error) {
    console.error(`${provider} token read failed`, error.message);
    return null;
  }
  return (data as TokenRow | null) ?? null;
}

async function store(provider: Provider, row: TokenRow) {
  const { error } = await (await db()).from("oauth_tokens").upsert({
    provider,
    access_token: row.access_token,
    refresh_token: row.refresh_token,
    expires_at: row.expires_at,
    scope: row.scope,
    updated_at: new Date().toISOString(),
  });
  if (error) console.error(`${provider} token save failed`, error.message);
}

async function refresh(provider: Provider, row: TokenRow): Promise<TokenRow | null> {
  let res: Response;
  if (provider === "strava") {
    res = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env["STRAVA_CLIENT_ID"] ?? "",
        client_secret: process.env["STRAVA_CLIENT_SECRET"] ?? "",
        grant_type: "refresh_token",
        refresh_token: row.refresh_token,
      }),
    });
  } else {
    const basic = btoa(`${process.env["SPOTIFY_CLIENT_ID"] ?? ""}:${process.env["SPOTIFY_CLIENT_SECRET"] ?? ""}`);
    res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${basic}` },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: row.refresh_token }),
    });
  }

  if (!res.ok) {
    console.error(`${provider} token refresh failed`, res.status);
    return null;
  }
  const t = (await res.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
    expires_in?: number;
    scope?: string;
  };
  if (!t.access_token) {
    console.error(`${provider} token refresh returned no access token`);
    return null;
  }

  const next: TokenRow = {
    provider,
    access_token: t.access_token,
    // Spotify doesn't rotate the refresh token; Strava may return the same one.
    refresh_token: t.refresh_token ?? row.refresh_token,
    expires_at: (
      t.expires_at ? new Date(t.expires_at * 1000) : new Date(Date.now() + (t.expires_in ?? 3600) * 1000)
    ).toISOString(),
    scope: t.scope ?? row.scope,
  };
  await store(provider, next);
  return next;
}

/** A usable access token, refreshed and saved when it expires within 5 minutes. */
export async function getAccessToken(provider: Provider): Promise<string | null> {
  const row = await load(provider);
  if (!row) return null;
  if (new Date(row.expires_at).getTime() - Date.now() > REFRESH_SKEW_MS) return row.access_token;
  const next = await refresh(provider, row);
  return next?.access_token ?? null;
}
