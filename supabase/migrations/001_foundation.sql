-- 001_foundation.sql
-- Infraestrutura base do Cash AI

-- 1. Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector"; -- Prepara para os embeddings no futuro

-- 2. Schemas
-- O Supabase já utiliza 'public' para a maioria das tabelas de domínio.
-- Vamos utilizar 'public' mas deixar documentado o uso nativo do 'storage' e 'auth' do Supabase.

-- 3. Tipos ENUM
CREATE TYPE workspace_type AS ENUM ('personal', 'family', 'business');
CREATE TYPE user_status AS ENUM ('LOADING', 'ONBOARDING', 'PAYMENT_PENDING', 'ACTIVE', 'BLOCKED', 'TRIAL');
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELED', 'UNPAID');
CREATE TYPE member_role AS ENUM ('owner', 'admin', 'member', 'accountant', 'partner');
CREATE TYPE message_source AS ENUM ('whatsapp', 'dashboard', 'system', 'api');
CREATE TYPE event_status AS ENUM ('pending', 'completed', 'canceled');
CREATE TYPE transaction_type AS ENUM ('income', 'expense');

-- 4. Funções Utilitárias (Helpers)
-- Função para atualizar automaticamente o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
