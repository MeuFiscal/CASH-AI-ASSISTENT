import { DashboardLayout } from '@/layouts/DashboardLayout';
import { PageContainer } from '@/components/PageContainer';
import { GreetingHeader } from './components/GreetingHeader';
import { PriorityCard } from './widgets/PriorityCard';
import { FinancialHealthCard } from './widgets/FinancialHealthCard';
import { AgendaOverviewCard } from './widgets/AgendaOverviewCard';
import { WhatsAppActivityCard } from './widgets/WhatsAppActivityCard';
import { RecentActivityCard } from './widgets/RecentActivityCard';
import { LearningCard } from './widgets/LearningCard';
import { MemoryCard } from './widgets/MemoryCard';
import { ProgressCard } from './widgets/ProgressCard';

import { DashboardProvider } from './contexts/DashboardContext';

export function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardLayout>
        <PageContainer>
        {/* Cabeçalho de Saudação */}
        <GreetingHeader />

        {/* Grid Architecture Sprint 4.2 */}
        <div className="flex flex-col gap-6">
          
          {/* NÍVEL 1 - O que merece atenção (100% width) */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
            <PriorityCard />
          </div>

          {/* NÍVEL 2 - Visão Tática (50% width) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            <FinancialHealthCard />
            <AgendaOverviewCard />
            <WhatsAppActivityCard />
            <RecentActivityCard />
          </div>

          {/* NÍVEL 3 - Visão de Suporte (33.3% width) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <LearningCard />
            <MemoryCard />
            <ProgressCard />
          </div>

        </div>
        </PageContainer>
      </DashboardLayout>
    </DashboardProvider>
  );
}
