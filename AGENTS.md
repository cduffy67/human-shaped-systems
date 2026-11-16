<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- OAuth callbacks are server routes under /api/public/*-callback (not edge functions); tokens live in RLS-locked oauth_tokens, written only via supabaseAdmin.

- Keep provisional case definitions and method-step anchors in a shared browser-safe module so case links and step backlinks remain aligned.
- Use an un-nested dynamic case-detail route so the case index does not wrap detail pages.
- Keep phase illustrations in a How I Work-only component using semantic mode colours and one-shot motion variants, so Journey imagery remains independent.
- Section entrances go through `Beats`/`BeatSection`/`PageHeader` (src/components/beats.tsx) with timings from src/lib/motion.ts; content lines opt in with the `.beat` class and illustrations wait on `useBeatsReady()`, so both modes share one choreography.
