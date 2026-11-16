import { Link } from "@tanstack/react-router";

export function CaseCTA({ children }: { children: string }) {
  return (
    <div className="border-t border-border pt-12">
      <Link to="/case-library" className="case-cta inline-block max-w-full font-display text-3xl font-extrabold leading-tight sm:text-4xl">
        {children} <span className="whitespace-nowrap">→ Case Library</span>
      </Link>
    </div>
  );
}