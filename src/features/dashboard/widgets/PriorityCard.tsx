import { DashboardCard } from '../components/DashboardCard';
import { AlertCircle, ArrowRight, CircleAlert, CheckCircle2 } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';

export function PriorityCard() {
  const { data, status } = useDashboard();

  if (status === 'loading') {
    return (
      <DashboardCard className="p-0 border-[#3B82F6]/20 bg-[#181C28]/50 h-[200px] flex items-center justify-center">
        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-white/5" />
          <div className="flex flex-col gap-2">
            <div className="w-32 h-4 bg-white/5 rounded-full" />
            <div className="w-48 h-3 bg-white/5 rounded-full" />
          </div>
        </div>
      </DashboardCard>
    );
  }

  const priorities = data?.priorities || [];

  if (status === 'empty' || priorities.length === 0) {
    return (
      <DashboardCard className="p-0 border-[#10B981]/20 bg-gradient-to-r from-[#10B981]/5 to-[#3B82F6]/5 relative group overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#10B981] to-transparent opacity-50" />
        <div className="p-5 sm:p-6 flex flex-col items-center justify-center gap-3 text-center min-h-[160px]">
          <div className="p-3 rounded-full bg-[#10B981]/10">
            <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
          </div>
          <h3 className="font-semibold text-[15px] text-white">Tudo sob controle</h3>
          <p className="text-[13px] text-[#A8B3CF] max-w-[280px]">
            Nenhuma prioridade urgente para hoje. Seu Centro de Inteligência está monitorando tudo em segundo plano.
          </p>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard className="p-0 border-[#3B82F6]/20 bg-gradient-to-r from-[#3B82F6]/5 to-[#8B5CF6]/5 relative group overflow-hidden flex flex-col justify-between h-auto">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
      
      <div className="p-5 sm:p-6 flex flex-col gap-4">
        
        <div className="flex items-center gap-2 mb-1 text-[#3B82F6]">
          <div className="p-1.5 rounded-lg bg-[#3B82F6]/10">
            <AlertCircle className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-[14px] tracking-wide text-white uppercase">Prioridades do Dia</h3>
        </div>

        <div className="flex flex-col mb-2">
          {priorities.map((priority, index) => (
            <div key={priority.id || index} className="flex items-center justify-between py-3.5 border-b border-white/[0.03] group/item last:border-0">
              <div className="flex items-center gap-3 min-w-0">
                <CircleAlert className="w-4 h-4 text-[#ef4444] shrink-0" />
                <span className="text-[14px] md:text-[15px] font-medium text-[#E2E8F0] truncate tracking-wide">
                  {priority.title}
                </span>
              </div>
              <button className="flex items-center gap-1 text-[12px] md:text-[13px] font-semibold text-[#3B82F6] hover:text-[#60A5FA] transition-colors shrink-0 ml-4 group-hover/item:translate-x-1 duration-300">
                Resolver agora
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
