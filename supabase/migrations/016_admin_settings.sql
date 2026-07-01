-- 016_admin_settings.sql
-- Tabela de configurações globais da plataforma

CREATE TABLE IF NOT EXISTS public.platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maintenance_mode BOOLEAN DEFAULT FALSE,
    allow_new_registrations BOOLEAN DEFAULT TRUE,
    free_trial_days INT DEFAULT 7,
    support_email TEXT DEFAULT 'suporte@cashai.com.br',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Garantir que sempre tenha apenas 1 linha
CREATE UNIQUE INDEX IF NOT EXISTS platform_settings_single_row_idx ON public.platform_settings ((true));

-- Inserir linha padrão caso não exista
INSERT INTO public.platform_settings (maintenance_mode, allow_new_registrations, free_trial_days, support_email)
SELECT FALSE, TRUE, 7, 'suporte@cashai.com.br'
WHERE NOT EXISTS (SELECT 1 FROM public.platform_settings);


-- RPC: Ler configurações
CREATE OR REPLACE FUNCTION admin_get_platform_settings()
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF NOT admin_check_access() THEN
        RAISE EXCEPTION 'Acesso negado';
    END IF;

    SELECT jsonb_build_object(
        'maintenance_mode', maintenance_mode,
        'allow_new_registrations', allow_new_registrations,
        'free_trial_days', free_trial_days,
        'support_email', support_email,
        'updated_at', updated_at
    ) INTO v_result
    FROM public.platform_settings
    LIMIT 1;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- RPC: Atualizar configurações
CREATE OR REPLACE FUNCTION admin_update_platform_settings(
    p_maintenance_mode BOOLEAN,
    p_allow_new_registrations BOOLEAN,
    p_free_trial_days INT,
    p_support_email TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF NOT admin_check_access() THEN
        RAISE EXCEPTION 'Acesso negado';
    END IF;

    UPDATE public.platform_settings
    SET maintenance_mode = p_maintenance_mode,
        allow_new_registrations = p_allow_new_registrations,
        free_trial_days = p_free_trial_days,
        support_email = p_support_email,
        updated_at = NOW(),
        updated_by = auth.uid()
    WHERE true;

    SELECT jsonb_build_object(
        'maintenance_mode', maintenance_mode,
        'allow_new_registrations', allow_new_registrations,
        'free_trial_days', free_trial_days,
        'support_email', support_email,
        'updated_at', updated_at
    ) INTO v_result
    FROM public.platform_settings
    LIMIT 1;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
