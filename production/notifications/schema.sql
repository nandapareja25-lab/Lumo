-- Notifications Team — FASE 1, esquema inicial (2026-07-23)
-- Sin cuentas reales todavía: se identifica por device_id anónimo, no por auth.users.
-- RLS habilitada SIN policies -> solo la service role key (usada server-side en la app)
-- puede leer/escribir. El cliente nunca toca esta tabla directo.

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  endpoint text NOT NULL,
  p256dh text NOT NULL,
  auth text NOT NULL,
  -- true = la familia quiere recibir avisos de esa categoría
  preferences jsonb NOT NULL DEFAULT '{
    "historias": true,
    "series": true,
    "versiculo-del-dia": true,
    "reflexion-del-dia": true,
    "oraciones": true,
    "contenido-nuevo": true
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(endpoint)
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
-- Sin CREATE POLICY a propósito: nadie con anon/authenticated key puede
-- leer ni escribir. Solo la service role key (bypassa RLS) puede.

-- Registro simple para anti-spam y analíticas (cuántas se enviaron, de qué categoría)
CREATE TABLE IF NOT EXISTS push_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  category text NOT NULL,
  title text NOT NULL,
  sent_at timestamptz DEFAULT now()
);

ALTER TABLE push_log ENABLE ROW LEVEL SECURITY;
