/**
 * Cash AI — Route Constants
 *
 * Single source of truth for all application routes.
 * Always reference these constants instead of hard-coding paths.
 */
export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  CADASTRO: '/cadastro',
  APP: '/app',
  ADMIN: '/admin',
  RECURSOS: '/recursos',
  INTEGRACOES: '/integracoes',
  PRECOS: '/precos',
  EMPRESA: '/empresa',
  DEMO: '/demo',
  DASHBOARD: '/dashboard',
} as const;

/**
 * Application metadata
 */
export const APP_CONFIG = {
  name: 'Cash AI',
  tagline: 'Seu segundo cérebro',
  description: 'Assistente pessoal inteligente para organizar sua agenda, finanças e documentos.',
} as const;
