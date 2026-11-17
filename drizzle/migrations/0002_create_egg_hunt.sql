CREATE TABLE public.egg_hunt (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 20),
  ms integer NOT NULL,
  eggs smallint NOT NULL DEFAULT 3,
  token uuid NOT NULL DEFAULT gen_random_uuid(),
  hidden boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.egg_hunt TO service_role;
ALTER TABLE public.egg_hunt ENABLE ROW LEVEL SECURITY;
CREATE INDEX egg_hunt_hidden_ms_idx ON public.egg_hunt (hidden, ms);