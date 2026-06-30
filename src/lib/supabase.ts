import { createClient } from '@supabase/supabase-js';

// As variáveis de ambiente devem ser configuradas no arquivo .env local do projeto
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Faltam variáveis de ambiente do Supabase (VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY).'
  );
}

/**
 * Cliente Supabase
 * Única Fonte da Verdade para Autenticação e Dados no Frontend
 */
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
