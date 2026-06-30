import { Brain, Calendar, DollarSign, FileText } from 'lucide-react';
import type { ElementType } from 'react';

// --- Interfaces for Future AI Integration ---

export interface QuickAction {
  id: string;
  label: string;
  icon: ElementType;
  action: string;
}

export interface DailyInsight {
  greeting: string;
  summary: string;
  tasks: string[];
  recommendation: string;
  actions: QuickAction[];
}

export interface PriorityInsight {
  title: string;
  description: string;
  impact: string;
  actionLabel: string;
}

export interface FinancialInsight {
  narrative: string;
  conclusion: string;
  availableBalance: number;
  income: number;
  expenses: number;
  savings: number;
}

export interface AgendaInsight {
  narrative: string;
  conclusion: string;
  freeTimeBlocks: number;
  intenseDays: string[];
}

export interface WhatsAppActivityInsight {
  summary: string;
  completedTasks: string[];
  lastSyncMinutesAgo: number;
  conclusion: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  description: string;
}

export interface TimelineInsight {
  title: string;
  events: TimelineEvent[];
}

export interface LearningInsight {
  title: string;
  habits: string[];
}

export interface MemoryInsight {
  title: string;
  intro: string;
  facts: string[];
}

export interface ProgressInsight {
  title: string;
  conclusion: string;
  metrics: {
    label: string;
    value: number;
  }[];
}


// --- Mock Data (Simulating AI Response) ---

export const DASHBOARD_MOCKS = {
  headerGreetings: [
    "Enquanto você descansava organizei sua rotina.",
    "Analisei sua agenda dos próximos dias.",
    "Seu financeiro está mais organizado hoje.",
    "Separei apenas o que merece sua atenção.",
    "Tudo já está preparado para você.",
    "Sua semana está ficando muito equilibrada.",
    "Organizei suas informações enquanto você estava ausente.",
    "Encontrei algumas oportunidades interessantes.",
    "Nenhuma informação importante passou despercebida.",
    "Hoje sua rotina parece muito tranquila."
  ],

  dailyIntelligence: {
    greeting: "Enquanto você estava fora...",
    summary: "Continuei organizando sua rotina.\nHoje eu preparei:",
    tasks: [
      "revisei seus compromissos",
      "organizei suas despesas",
      "encontrei uma economia de R$ 840",
      "arquivei documentos",
      "atualizei seu painel",
      "preparei sua agenda"
    ],
    recommendation: "Tudo pronto.\nO que deseja fazer agora?",
    actions: [
      { id: 'chat', label: 'Conversar com a IA', icon: Brain, action: '/chat' },
      { id: 'agenda', label: 'Abrir Agenda', icon: Calendar, action: '/agenda' },
      { id: 'finance', label: 'Ver Finanças', icon: DollarSign, action: '/finances' },
      { id: 'docs', label: 'Documentos', icon: FileText, action: '/documents' }
    ]
  } as DailyInsight,

  priority: {
    title: "Hoje eu faria isso primeiro.",
    description: "Revise o contrato de aluguel antes da renovação.",
    impact: "Se resolver isso hoje você evita preocupações amanhã.",
    actionLabel: "Resolver agora"
  } as PriorityInsight,

  financial: {
    narrative: "Seu fluxo financeiro continua saudável.\nVocê terminou a semana com saldo positivo.\nEconomizou mais do que no mês passado.",
    conclusion: "Continue nesse ritmo e você atingirá sua meta mensal.",
    availableBalance: 12450.00,
    income: 4200.00,
    expenses: 1250.00,
    savings: 840.00
  } as FinancialInsight,

  agenda: {
    narrative: "Sua quarta-feira será bastante intensa.\nVocê possui bastante tempo livre na sexta.\nExistem boas janelas para foco profundo.",
    conclusion: "Sua semana está equilibrada.\nSexta-feira será um excelente dia para reuniões importantes.",
    freeTimeBlocks: 4,
    intenseDays: ["Quarta-feira"]
  } as AgendaInsight,

  whatsapp: {
    summary: "Enquanto você estava fora...",
    completedTasks: [
      "registrei duas despesas",
      "organizei três compromissos",
      "arquivei dois documentos",
      "respondi lembretes",
      "atualizei seu painel"
    ],
    lastSyncMinutesAgo: 2,
    conclusion: "Tudo foi registrado.\nNenhuma informação importante ficou para trás."
  } as WhatsAppActivityInsight,

  timeline: {
    title: "O que fiz recentemente",
    events: [
      { id: '1', time: '09:22', description: 'Agenda atualizada para refletir seus novos horários.' },
      { id: '2', time: '09:31', description: 'Otimizei o registro da sua última despesa.' },
      { id: '3', time: '09:55', description: 'Organizei um novo documento na sua pasta segura.' },
      { id: '4', time: '10:08', description: 'Gerei um novo insight sobre seus gastos.' },
      { id: '5', time: '10:22', description: 'Confirmei seu compromisso para a tarde.' }
    ]
  } as TimelineInsight,

  learning: {
    title: "Estou começando a entender você.",
    habits: [
      "Você costuma registrar despesas à noite.",
      "Prefere reuniões pela manhã.",
      "Se organiza melhor às sextas.",
      "Costuma responder mensagens após o almoço."
    ]
  } as LearningInsight,

  memory: {
    title: "O que já aprendi sobre você.",
    intro: "Baseado no seu histórico...",
    facts: [
      "Prefere Deep Work pela manhã.",
      "Sempre paga contas antes do vencimento.",
      "Suas maiores despesas acontecem aos finais de semana.",
      "Você costuma revisar contratos às sextas."
    ]
  } as MemoryInsight,

  progress: {
    title: "Como você está evoluindo.",
    conclusion: "Sua evolução continua consistente.",
    metrics: [
      { label: "Organização", value: 85 },
      { label: "Produtividade", value: 92 },
      { label: "Economia", value: 78 },
      { label: "Rotina", value: 88 }
    ]
  } as ProgressInsight
};
