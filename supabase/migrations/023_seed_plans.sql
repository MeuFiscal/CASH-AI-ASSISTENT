-- 023_seed_plans.sql
-- Seed de planos para concessão e alteração pelo Admin OS

INSERT INTO public.plans (id, name, description, price, billing_period, is_active)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Gratuito', 'Recursos básicos para iniciar', 0.00, 'mensal', true),
  ('00000000-0000-0000-0000-000000000002', 'Pro (Segundo Cérebro)', 'Acesso completo ao Segundo Cérebro e IA', 29.90, 'mensal', true),
  ('00000000-0000-0000-0000-000000000003', 'Business', 'Recursos avançados e IA privada', 59.90, 'mensal', true),
  ('00000000-0000-0000-0000-000000000004', 'Enterprise / Ilimitado', 'Suporte dedicado e ferramentas exclusivas', 99.90, 'mensal', true)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  is_active = true;

NOTIFY pgrst, 'reload schema';
