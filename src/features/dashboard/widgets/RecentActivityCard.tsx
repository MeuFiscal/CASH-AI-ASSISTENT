import { Activity } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
import { useDashboard } from '../hooks/useDashboard';

export function RecentActivityCard() {
  const { status } = useDashboard();

  if (status === 'loading') {
    return (
      <DashboardCard className="p-0 bg-[#181C28]/50 h-[300px] flex items-center justify-center border-white/5">
        <div className="flex flex-col gap-4 w-full px-8 animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-white/10 rounded-full" />
            <div className="w-24 h-4 bg-white/5 rounded-full" />
          </div>
          <div className="w-full h-12 bg-white/5 rounded-md" />
        </div>
      </DashboardCard>
    );
  }

  // As per RPC, we don't have explicit activity log yet. We show the premium empty state.
  return (
    <DashboardCard className="p-0 border-[#F59E0B]/20 bg-gradient-to-br from-[#181C28] to-[#0B1221] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/5 rounded-full blur-[50px]" />
      <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
        <div className="w-12 h-12 rounded-full bg-[#F59E0B]/10 flex items-center justify-center mb-4">
          <Activity className="w-6 h-6 text-[#F59E0B]" />
        </div>
        <h3 className="text-[16px] font-semibold text-white mb-2">Monitoramento Silencioso</h3>
        <p className="text-[14px] text-[#A8B3CF] leading-relaxed max-w-[280px]">
          Qualquer ação realizada, seja no WhatsApp, Google Agenda ou Asaas, será registrada aqui para sua segurança.
        </p>
      </div>
    </DashboardCard>
  );
}
