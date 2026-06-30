export type SubscriptionStatus = 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELED' | 'UNPAID';
export type UserStatus = 'LOADING' | 'ONBOARDING' | 'PAYMENT_PENDING' | 'ACTIVE' | 'BLOCKED' | 'TRIAL';

/**
 * Organization (Multi-tenant Foundation)
 * Representa uma empresa ou entidade pagante
 */
export interface Organization {
  id: string;
  name: string;
  slug: string;
  document?: string; // CNPJ ou CPF
  createdAt: string;
}

/**
 * Workspace (Multi-tenant Foundation)
 * Um ambiente isolado de dados dentro de uma organização
 */
export interface Workspace {
  id: string;
  organizationId: string;
  name: string;
  createdAt: string;
}

/**
 * User (Supabase Auth / Public Profile)
 * Única Fonte da Verdade do Usuário
 */
export interface User {
  id: string; // Refers to auth.users.id
  email: string;
  name: string;
  phone: string;
  address?: string;
  avatarUrl?: string;
  whatsapp: string;
  whatsappConnected: boolean;
  status: UserStatus;
  
  // Organization bindings
  defaultOrganizationId?: string;
  defaultWorkspaceId?: string;
  
  // Flags
  onboardingCompleted: boolean;
  firstAccess: boolean;
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Subscription (Asaas Foundation)
 * Gerenciamento de assinaturas
 */
export interface Subscription {
  id: string;
  organizationId: string;
  planId: string; // Ex: 'price_premium_123'
  status: SubscriptionStatus;
  asaasCustomerId?: string;
  asaasSubscriptionId?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt?: string;
  cancelAtPeriodEnd: boolean;
}
