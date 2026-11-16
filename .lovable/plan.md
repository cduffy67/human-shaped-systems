# Build Log rebuild: two-room changelog

## Content
- One list of 10 versions (v0 to v9) with your new wording: title, summary, status, "AI did" and "I decided".
- v7 "Two rooms" and v8 "Plugged into real life" are new. v9 "Out in the world, still unfinished" is the only ongoing entry.
- Newest first (v9 at the top). The closing line stays under the list.

## Boardroom
- Same look as now: terracotta version number, small SHIPPED/ONGOING label, serif title and summary.
- A small "+" on the right of each row. Clicking a row smoothly opens (about 250ms) a "How it was made" block:
  - 🤖 AI did: ...
  - 🧠 I decided: ...
- Only one row can be open at a time.

## Engine room
- A terminal-style log in monospace on espresso. Each row reads like `v4  second-pass-with-ai-in-the-loop  [shipped]`.
- Clicking a row opens a terminal block that types out `$ ./explain v4`, then title, summary, ai_did, i_decided and status (✓ shipped / … ongoing), all lowercase, and ends with a blinking cursor on a new `$` line.
- Typing runs at about 20ms per character with a 150ms pause between lines. Clicking during typing finishes it instantly.
- Each version only animates the first time it's opened in a visit; after that it appears instantly.
- The `$` and field names are terracotta, the values parchment. Only one version is open at a time.

## Accessibility
- Rows are buttons that tell screen readers whether they're open.
- Screen readers get the full text immediately; the typing is visual only.
- If the visitor's device asks for reduced motion, the text appears instantly in both rooms.

## Technical details
- `src/routes/build-log.tsx`: a single `ENTRIES` array with the fields version, title, summary, status, ai_did and i_decided, rendered in reverse order. It switches between `BoardroomLog` and `EngineLog` using `useSiteMode`.
- Boardroom: framer-motion `AnimatePresence` height animation.
- Engine room: a `useTypewriter` hook. A module-level `Set` records versions already played this visit. The animated text has `aria-hidden`/`aria-live="off"` and there is an `sr-only` full copy. `useReducedMotion` skips the animation.
- The print page reuses the same entries.
