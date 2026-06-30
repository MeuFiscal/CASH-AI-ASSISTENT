/**
 * Cash AI - Serviços Desacoplados (Arquitetura OS)
 *
 * O frontend NUNCA executa regras de negócio.
 * Todas as regras, interpretações e fluxos são definidos nesta camada,
 * que idealmente rodará em Edge Functions / Backend.
 */

// 1. WhatsApp Reception
export interface ReceiverService {
  processIncomingWebhook(payload: any): Promise<void>;
}

// 2. AI Interpreter
export interface InterpreterService {
  extractIntent(message: string): Promise<{
    action: 'RECORD_EXPENSE' | 'SCHEDULE_EVENT' | 'SAVE_DOCUMENT' | 'ASK_QUESTION';
    data: any;
  }>;
}

// 3. Database Persistence
export interface PersistenceService {
  saveExpense(userId: string, data: any): Promise<void>;
  saveEvent(userId: string, data: any): Promise<void>;
  // ...
}

// 4. Memory (Second Brain)
export interface MemoryService {
  updateUserContext(userId: string, newFacts: string[]): Promise<void>;
  retrieveRelevantContext(userId: string, query: string): Promise<string[]>;
}

// 5. Insights (Calculations & Recommendations)
export interface InsightService {
  recalculateFinancialHealth(userId: string): Promise<void>;
  generateDailyBriefing(userId: string): Promise<any>;
}

// 6. Dashboard (Read Model)
export interface DashboardService {
  buildIntelligenceCenter(userId: string): Promise<{
    greeting: string;
    financialHealth: any;
    priorities: any[];
    agenda: any[];
    recentActivities: any[];
  }>;
}

// 7. Core AI (OpenAI Abstraction)
export interface OpenAIService {
  chat(prompt: string, context: any): Promise<string>;
  extractJson(prompt: string, schema: any): Promise<any>;
}

// 8. Notification & Magic Links
export interface NotificationService {
  evaluateShouldNotify(userId: string, context: any): Promise<boolean>;
  sendMagicLink(userId: string, phone: string, redirectUrl: string): Promise<void>;
}
