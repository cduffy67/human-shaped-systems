import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { FileDown } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ToggleNudge } from "../components/toggle-nudge";
import { initSiteMode, setSiteMode, useSiteMode, type SiteMode } from "../lib/mode";
import { CommandPalette, openPalette } from "../components/command-palette";
import { HomeChimneys } from "../components/home-chimneys";
import { EasterEggs, MuteToggle, SnailFooterLine } from "../components/easter-eggs";
import { Toaster } from "../components/ui/sonner";

const NAV = [
  { to: "/", label: "Home", path: "~/home" },
  { to: "/how-i-work", label: "How I Work", path: "~/how-i-work" },
  { to: "/journey", label: "Journey", path: "~/journey" },
  { to: "/build-log", label: "Build Log", path: "~/build-log" },
  { to: "/case-library", label: "Case Library", path: "~/cases" },
  { to: "/contact", label: "Contact", path: "~/contact" },
] as const;

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl">404</h1>
        <h2 className="mt-4 text-xl">This page wandered off</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Nothing here yet. In a garden, that's fair enough.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-sm bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went sideways. Try again, or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-sm bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-sm border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Conor Duffy · Enterprise problems, human-shaped solutions" },
      {
        name: "description",
        content:
          "Irish enterprise solutions engineer in London, working on AI adoption, value-led solution design and practical architecture.",
      },
      { name: "author", content: "Conor Duffy" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:ital,wght@0,400..900;1,400..900&family=IBM+Plex+Mono:wght@400;500&family=JetBrains+Mono:wght@400;500;800&family=Caveat:wght@600&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function ModeToggle() {
  const mode = useSiteMode();
  const choose = (m: SiteMode) => {
    if (m === mode) return;
    const root = document.documentElement;
    root.classList.add("mode-anim");
    setSiteMode(m);
    window.setTimeout(() => root.classList.remove("mode-anim"), 450);
  };
  const opts: { id: SiteMode; label: string }[] = [
    { id: "boardroom", label: "Boardroom" },
    { id: "engine", label: "Engine room" },
  ];
  return (
    <div
      role="radiogroup"
      aria-label="Site mode"
      className="mode-mono inline-flex shrink-0 overflow-hidden rounded-full border border-border text-[0.7rem] sm:text-xs"
    >
      {opts.map((o, i) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={mode === o.id}
          onClick={() => choose(o.id)}
          className={`whitespace-nowrap px-2.5 py-1 transition-colors sm:px-3 ${i ? "border-l border-border" : ""} ${
            mode === o.id
              ? "bg-toggle-on text-toggle-on-foreground"
              : "text-ink-soft hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const engine = useSiteMode() === "engine";
  const linkBase =
    "quiet-link relative py-1 text-sm text-ink-soft transition-colors hover:text-foreground";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <span className="inline-flex items-baseline gap-1.5">
          <Link to="/" className="whitespace-nowrap font-display text-lg tracking-tight">
            Conor Duffy
          </Link>
          <HomeChimneys size="sm" />
        </span>

        <nav className={`hidden items-center md:flex ${engine ? "gap-4 text-xs" : "gap-5 xl:gap-7"}`}>
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`${linkBase} whitespace-nowrap ${engine ? "!text-[0.8rem]" : ""}`}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-foreground font-medium" }}
            >
              {engine ? item.path : item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button type="button" onClick={openPalette} aria-label="Open command menu" title="Command menu (⌘K)" className={`mode-mono hidden rounded-[4px] border border-border px-1.5 py-0.5 text-xs transition-colors hover:text-foreground sm:inline ${engine ? "text-accent" : "text-muted-foreground"}`}>
            ⌘K
          </button>
          <div className="relative"><ModeToggle /><ToggleNudge /></div>
          <Link
            to="/print"
            className="quiet-link relative inline-flex items-center gap-1.5 py-1 text-sm text-ink-soft transition-colors hover:text-foreground"
            title="Open a printable version of the whole site"
          >
            <FileDown className="h-4 w-4" aria-hidden="true" />
            <span className="hidden whitespace-nowrap 2xl:inline">Export PDF</span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="text-sm text-ink-soft md:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="flex flex-col border-t border-border px-5 pb-4 pt-1 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="border-b border-border/60 py-2.5 text-sm text-ink-soft"
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-foreground font-medium" }}
            >
              {engine ? item.path : item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-border">
      {/* `home` easter egg: the chimneys stand on the footer line, above "London / Ireland". */}
      <div className="pointer-events-none absolute inset-x-0 bottom-full">
        <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
          <div className="absolute bottom-0 right-[4.75rem] sm:right-24">
            <HomeChimneys size="lg" />
          </div>
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-3 px-5 py-10 text-sm text-muted-foreground sm:grid-cols-3 sm:px-8">
        <div className="sm:justify-self-start"><SnailFooterLine /></div>
        <a href="/llms.txt" className="quiet-link relative mode-mono justify-self-start text-xs transition-colors hover:text-foreground sm:justify-self-center" title="A plain-text summary of this site for AI assistants">For agents: /llms.txt</a>
        <div className="flex items-center gap-4 sm:justify-self-end"><p>London / Ireland</p><MuteToggle /></div>
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => {
    initSiteMode();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          {/* Required: nested routes render here. */}
          <Outlet />
        </main>
        <Footer />
      </div>
      <CommandPalette />
      <EasterEggs />
      <Toaster position="bottom-center" />
    </QueryClientProvider>
  );
}
