// Shared OAuth callback handling for Strava and Spotify. Server-only.
type Provider = "strava" | "spotify";
const NAMES: Record<Provider, string> = { strava: "Strava", spotify: "Spotify" };

function page(title: string, status: number) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title></head><body style="font-family:Georgia,serif;background:#f4ede1;color:#2a1f19;display:grid;place-items:center;min-height:100vh;margin:0"><h1 style="font-weight:500">${title}</h1></body></html>`;
  return new Response(html, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function handleOAuthCallback(provider: Provider, request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expected = process.env['OAUTH_STATE_SECRET'];
  if (!expected || !state || !safeEqual(state, expected)) return page("Invalid state", 403);
  if (!code || code.length > 2048) return page("Missing code", 400);

  let res: Response;
  if (provider === "strava") {
    res = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env['STRAVA_CLIENT_ID'] ?? "",
        client_secret: process.env['STRAVA_CLIENT_SECRET'] ?? "",
        code,
        grant_type: "authorization_code",
      }),
    });
  } else {
    const basic = btoa(`${process.env['SPOTIFY_CLIENT_ID'] ?? ""}:${process.env['SPOTIFY_CLIENT_SECRET'] ?? ""}`);
    res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${basic}` },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${url.origin}${url.pathname}`,
      }),
    });
  }
  if (!res.ok) {
    console.error(`${provider} token exchange failed`, res.status);
    return page(`${NAMES[provider]} connection failed`, 502);
  }
  const t = (await res.json()) as {
    access_token?: string; refresh_token?: string; expires_at?: number; expires_in?: number; scope?: string;
  };
  if (!t.access_token || !t.refresh_token) return page(`${NAMES[provider]} connection failed`, 502);
  const expiresAt = t.expires_at
    ? new Date(t.expires_at * 1000)
    : new Date(Date.now() + (t.expires_in ?? 3600) * 1000);
  // Strava returns scope via the redirect query, Spotify in the token body.
  const scope = t.scope ?? url.searchParams.get("scope");

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.from("oauth_tokens").upsert({
    provider,
    access_token: t.access_token,
    refresh_token: t.refresh_token,
    expires_at: expiresAt.toISOString(),
    scope,
    updated_at: new Date().toISOString(),
  });
  if (error) {
    console.error(`${provider} token save failed`, error.message);
    return page(`${NAMES[provider]} connection failed`, 500);
  }
  return page(`${NAMES[provider]} connected ✓`, 200);
}
