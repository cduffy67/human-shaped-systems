# Conor Duffy — personal site (MVP)

A warm, lightly whimsical digital-garden-style site. Five pages, card-based, fast to publish, easy to edit.

## Note on the portrait

No photo came through with this message. I'll build the homepage portrait area with a soft circular frame and a warm abstract placeholder shape in the meantime — drop the image into chat any time and I'll swap it in with no layout changes.

## Look and feel

- Warm palette: soft cream/paper background, ink-brown text, a muted moss-green primary and a warm terracotta accent. No corporate blue, no purple gradients.
- Typography: a characterful serif for headings paired with a clean humanist sans for body.
- Generous rounded corners, soft layered shadows, subtle paper-grain texture.
- Small hand-drawn-feel doodle marks (arrows, underlines, asterisks) as section accents.
- Motion kept light: gentle fade/rise on scroll, small card lift on hover. Nothing heavy.
- Fully responsive; nav collapses to a simple mobile menu.

## Pages

**Home** — hero with name, "Enterprise problems, human-shaped solutions.", the subheading and intro line, portrait in a soft circular frame. Below: the 5 strength cards (Value-led Solutions, Ambiguity to Execution, Executive to Technical Fluency, Pragmatic Architecture, Measurable ROI), then a playful "Currently exploring" section with the 5 exploration cards in a looser, sticker-like layout. This page gets the most polish.

**How I Work** — the six steps as a numbered vertical framework with a connecting line, each with a plain-English paragraph.

**Build Log** — intro copy, then a v0–v6 timeline with dot markers and version chips, closing with the "point is not to build the most complex site" note in a soft callout.

**Case Library** — intro and sensitivity note, a simple password input (front-end only, no auth wired up), and four locked placeholder cards with a lock motif and blurred/muted styling.

**Contact** — friendly copy, cards for LinkedIn, Email, GitHub (placeholder links, clearly marked for you to fill in), and a London / Ireland location line.

Shared top nav (Home, How I Work, Build Log, Case Library, Contact) and footer with "Built quickly, tweaked slowly."

## Technical notes

- Tokens defined in `src/styles.css` (`@theme inline`), fonts loaded via `<link>` in `__root.tsx`. No hardcoded colour classes.
- Nav + footer live in `__root.tsx` around `<Outlet />`; each page is its own route file with its own `head()` metadata (title, description, og/twitter).
- Copy strings kept at the top of each route file as plain arrays/objects so they're easy to edit.
- A few small shared components (`SectionHeading`, `Card`, `Doodle`) rather than one big file.
- Case Library password input is presentational only — it does not gate real content. Real gating can be added later with a server-side check.

## Left for later

Swapping in the real portrait, real contact links, actual case-study content and real password gating.
