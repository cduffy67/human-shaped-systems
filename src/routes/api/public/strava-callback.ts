import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/strava-callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { handleOAuthCallback } = await import("@/lib/oauth/callback.server");
        return handleOAuthCallback("strava", request);
      },
    },
  },
});
