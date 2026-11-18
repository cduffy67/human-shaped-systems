import { createFileRoute, redirect } from "@tanstack/react-router";

/** Retired page: kept as a redirect so old links still land somewhere useful. */
export const Route = createFileRoute("/how-i-work")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
});
