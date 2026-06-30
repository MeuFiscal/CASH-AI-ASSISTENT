import { Lightbulb } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
import { useDashboard } from '../hooks/useDashboard';

export function LearningCard() {
  const { status } = useDashboard();

  if (status === 'loading') {
    return (
      <DashboardCard className="p-0 bg-[#181C28]/50 h-[200px] flex items-center justify-center border-white/5">
        <div className="w-12 h-12 bg-white/5 rounded-full animate-pulse" />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard className="p-0 border-[#3B82F6]/20 bg-gradient-to-br from-[#181C28] to-[#0B1221] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/5 rounded-full blur-[50px]" />
      <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center h-full min-h-[220px]">
        <div className="w-12 h-12 rounded-full bg-[#3B82F6]/10 flex items-center justify-center mb-4">
          <Lightbulb className="w-6 h-6 text-[#3B82F6]" />
        </div>
        <h3 className="text-[15px] font-semibold text-white mb-2">Processando Padrões</h3>
        <p className="text-[13px] text-[#A8B3CF] leading-relaxed max-w-[250px]">
          Estou analisando seu comportamento para otimizar suas finanças. Em breve trarei sugestões valiosas.
        </p>
      </div>
    </DashboardCard>
  );
}
