CREATE TABLE public.live_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  payload jsonb NOT NULL,
  captured_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX live_stats_source_time ON public.live_stats (source, captured_at DESC);
GRANT ALL ON public.live_stats TO service_role;
ALTER TABLE public.live_stats ENABLE ROW LEVEL SECURITY;