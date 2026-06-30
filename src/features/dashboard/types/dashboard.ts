export type DashboardStateStatus = 'loading' | 'empty' | 'ready' | 'error';

export interface DashboardWorkspaceData {
  id: string;
  name: string;
  plan: string;
}

export interface DashboardFinancialData {
  balance: number;
  income_today: number;
  expense_today: number;
}

export interface DashboardAgendaEvent {
  id: string;
  title: string;
  time: string;
}

export interface DashboardInsight {
  id: string;
  title: string;
  description: string;
}

export interface DashboardWhatsappMessage {
  id: string;
  content: string;
  created_at: string;
}

export interface DashboardData {
  status: DashboardStateStatus;
  workspace: DashboardWorkspaceData;
  financial: DashboardFinancialData;
  agenda: DashboardAgendaEvent[];
  priorities: DashboardInsight[];
  whatsapp: DashboardWhatsappMessage[];
  memory: any; // expand later
  insights: any; // expand later
  documents: any; // expand later
  notifications: any; // expand later
  last_update: string;
  next_refresh: string;
  version: number;
}

export interface DashboardServiceResponse {
  data: DashboardData | null;
  error: Error | null;
}
