import { createFileRoute, redirect } from "@tanstack/react-router";

/** Retired page: kept as a redirect so old links still land somewhere useful. */
export const Route = createFileRoute("/case-library_/$slug")({
  beforeLoad: () => {
    throw redirect({ to: "/lab", replace: true });
  },
});
