import { createFileRoute } from "@tanstack/react-router";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";

export const Route = createFileRoute("/api/public/jobs/snapshot-stats")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authFailure = await authenticateCronRequest(request);
        if (authFailure) return authFailure;

        const body = (await request.json().catch(() => ({}))) as { source?: unknown };
        const source = body.source === "strava" || body.source === "spotify" ? body.source : "duolingo";

        const { runSnapshot } = await import("@/lib/live/snapshot.server");
        const result = await runSnapshot(source);
        return Response.json({ success: result.ok, source });
      },
    },
  },
});
