import { Calendar, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
import { useDashboard } from '../hooks/useDashboard';

export function AgendaOverviewCard() {
  const { data, status } = useDashboard();

  if (status === 'loading') {
    return (
      <DashboardCard className="p-0 bg-[#181C28]/50 h-[300px] flex items-center justify-center border-white/5">
        <div className="flex flex-col gap-4 w-full px-8 animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-white/10 rounded-full" />
            <div className="w-24 h-4 bg-white/5 rounded-full" />
          </div>
          <div className="w-full h-12 bg-white/5 rounded-md" />
          <div className="w-full h-12 bg-white/5 rounded-md" />
        </div>
      </DashboardCard>
    );
  }

  const agenda = data?.agenda || [];

  if (status === 'empty' || agenda.length === 0) {
    return (
      <DashboardCard className="p-0 border-[#3B82F6]/20 bg-gradient-to-br from-[#181C28] to-[#0B1221] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/5 rounded-full blur-[50px]" />
        <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
          <div className="w-12 h-12 rounded-full bg-[#3B82F6]/10 flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-[#3B82F6]" />
          </div>
          <h3 className="text-[16px] font-semibold text-white mb-2">Sua agenda está livre</h3>
          <p className="text-[14px] text-[#A8B3CF] leading-relaxed max-w-[280px]">
            Sua agenda ainda está vazia. Experimente dizer:<br/><br/>
            <span className="text-white italic">"Marque uma reunião amanhã às 14 horas."</span>
          </p>
        </div>
      </DashboardCard>
    );
  }

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <DashboardCard className="p-0 flex flex-col justify-between group h-auto">
      <div className="p-5 sm:p-6 flex flex-col gap-4">
        
        <div className="flex items-center gap-2 mb-2 text-[#8B5CF6]">
          <div className="p-1.5 rounded-lg bg-[#8B5CF6]/10">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-[14px] tracking-wide text-white uppercase">Agenda (Hoje)</h3>
        </div>

        <div className="flex flex-col gap-3">
          {agenda.map((event, i) => (
            <div key={event.id || i} className="flex items-start gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors group/item cursor-pointer">
              <div className="flex flex-col items-center min-w-[50px]">
                <span className="text-[13px] font-bold text-[#A8B3CF] group-hover/item:text-white transition-colors">
                  {formatTime(event.time)}
                </span>
                <Clock className="w-3.5 h-3.5 text-[#8B5CF6] mt-1" />
              </div>
              
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[14px] md:text-[15px] font-semibold text-white truncate">
                  {event.title}
                </span>
              </div>

              <button className="opacity-0 group-hover/item:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-white/10 text-[#8B5CF6]">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

      </div>
      
      {/* Footer Interpretation */}
      <div className="px-5 py-4 sm:px-6 bg-[#8B5CF6]/[0.02] border-t border-[#8B5CF6]/10 flex items-start gap-3 mt-auto">
        <CheckCircle2 className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
        <p className="text-[13px] text-[#E2E8F0] font-medium tracking-wide">
          Sua agenda está sincronizada com seus eventos.
        </p>
      </div>
    </DashboardCard>
  );
}
