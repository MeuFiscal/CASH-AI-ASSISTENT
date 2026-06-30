import { MessageSquare, CheckCircle2, Smartphone } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
import { useDashboard } from '../hooks/useDashboard';

export function WhatsAppActivityCard() {
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

  const whatsapp = data?.whatsapp || [];

  if (status === 'empty' || whatsapp.length === 0) {
    return (
      <DashboardCard className="p-0 border-[#10B981]/20 bg-gradient-to-br from-[#181C28] to-[#0B1221] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/5 rounded-full blur-[50px]" />
        <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
          <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center mb-4">
            <Smartphone className="w-6 h-6 text-[#10B981]" />
          </div>
          <h3 className="text-[16px] font-semibold text-white mb-2">WhatsApp Silencioso</h3>
          <p className="text-[14px] text-[#A8B3CF] leading-relaxed max-w-[280px]">
            Seu portal de comunicação oficial. Tudo o que conversarmos por lá aparecerá magicamente aqui.
          </p>
        </div>
      </DashboardCard>
    );
  }

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `há ${minutes} minutos`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours} horas`;
    return `há ${Math.floor(hours / 24)} dias`;
  };

  return (
    <DashboardCard className="p-0 flex flex-col justify-between group h-auto">
      <div className="p-5 sm:p-6 flex flex-col gap-4">
        
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#10B981] min-w-0">
            <MessageSquare className="w-4 h-4 shrink-0" />
            <h3 className="font-semibold text-[13px] md:text-[14px] tracking-wide text-white uppercase truncate">WhatsApp</h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)] shrink-0" />
            <span className="text-[10px] md:text-[11px] font-medium text-[#7B879D] uppercase tracking-wider">Sincronizado</span>
          </div>
        </div>

        <div className="flex flex-col mb-2">
          {whatsapp.map((msg, i) => (
            <div key={msg.id || i} className="flex flex-col py-3 border-b border-white/[0.03] last:border-0">
              <span className="text-[14px] md:text-[15px] font-medium text-white mb-1">{msg.content}</span>
              <span className="text-[12px] text-[#A8B3CF]">{timeAgo(msg.created_at)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Interpretation */}
      <div className="px-5 py-4 sm:px-6 bg-[#10B981]/[0.02] border-t border-[#10B981]/10 flex items-start gap-3 mt-auto">
        <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
        <p className="text-[13px] text-[#E2E8F0] font-medium tracking-wide">
          Sincronização em tempo real.
        </p>
      </div>
    </DashboardCard>
  );
}
