import { MessageSquare, ArrowUpRight, ArrowDownRight, Smartphone, Link } from 'lucide-react';

export function WhatsAppStats({ stats, loading }: { stats: any, loading: boolean }) {
  return (
    <div className="bg-[#181C28]/60 border border-white/5 backdrop-blur-md rounded-2xl p-5 w-full flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-[#22C55E]" />
        <h3 className="text-white font-medium">WhatsApp Hub</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="bg-[#0A0D14]/50 p-4 rounded-xl border border-white/5 flex flex-col justify-center items-center text-center">
          <div className="text-xs text-[#A8B3CF] mb-2 flex items-center gap-1.5"><ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" /> Enviadas Hoje</div>
          <div className="text-2xl font-bold text-white">{loading ? '...' : (stats?.sent || 0).toLocaleString('pt-BR')}</div>
        </div>
        <div className="bg-[#0A0D14]/50 p-4 rounded-xl border border-white/5 flex flex-col justify-center items-center text-center">
          <div className="text-xs text-[#A8B3CF] mb-2 flex items-center gap-1.5"><ArrowDownRight className="w-3.5 h-3.5 text-blue-400" /> Recebidas Hoje</div>
          <div className="text-2xl font-bold text-white">{loading ? '...' : (stats?.received || 0).toLocaleString('pt-BR')}</div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#0A0D14]/30 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-[#22C55E]/10 p-2 rounded-lg"><MessageSquare className="w-4 h-4 text-[#22C55E]" /></div>
            <span className="text-sm text-[#A8B3CF]">Conversas Ativas</span>
          </div>
          <span className="font-medium text-white">{loading ? '...' : stats?.active_conversations || 0}</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#0A0D14]/30 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-lg"><Link className="w-4 h-4 text-blue-500" /></div>
            <span className="text-sm text-[#A8B3CF]">Webhooks Processados</span>
          </div>
          <span className="font-medium text-white">{loading ? '...' : stats?.webhooks || 0}</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#0A0D14]/30 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-[#8B5CF6]/10 p-2 rounded-lg"><Smartphone className="w-4 h-4 text-[#8B5CF6]" /></div>
            <span className="text-sm text-[#A8B3CF]">Números Conectados</span>
          </div>
          <span className="font-medium text-white">{loading ? '...' : stats?.numbers_connected || 0}</span>
        </div>
      </div>
    </div>
  );
}
