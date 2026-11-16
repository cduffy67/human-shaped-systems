import { createFileRoute } from "@tanstack/react-router";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";

export const Route = createFileRoute("/api/public/jobs/snapshot-stats")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authFailure = await authenticateCronRequest(request);
        if (authFailure) return authFailure;
        const { fetchDuolingo } = await import("@/lib/live/sources.server");
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const d = await fetchDuolingo();
        if (d) await supabaseAdmin.from("live_stats").insert({ source: "duolingo", payload: d });
        return Response.json({ success: true, duolingo: !!d });
      },
    },
  },
});
