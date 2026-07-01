import { BrainCircuit, Zap, Clock, Coins } from 'lucide-react';

export function AiUsageCard({ stats, loading }: { stats: any, loading: boolean }) {
  return (
    <div className="bg-[#181C28]/60 border border-white/5 backdrop-blur-md rounded-2xl p-5 w-full flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <BrainCircuit className="w-5 h-5 text-[#8B5CF6]" />
        <h3 className="text-white font-medium">Uso da IA (OpenAI)</h3>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0A0D14]/50 p-3 rounded-xl border border-white/5">
            <div className="text-xs text-[#A8B3CF] mb-1 flex items-center gap-1.5"><Zap className="w-3 h-3" /> Tokens Hoje</div>
            <div className="text-lg font-semibold text-white">{loading ? '...' : (stats?.tokens_today || 0).toLocaleString('pt-BR')}</div>
          </div>
          <div className="bg-[#0A0D14]/50 p-3 rounded-xl border border-white/5">
            <div className="text-xs text-[#A8B3CF] mb-1 flex items-center gap-1.5"><Zap className="w-3 h-3" /> Tokens Mês</div>
            <div className="text-lg font-semibold text-white">{loading ? '...' : (stats?.tokens_month || 0).toLocaleString('pt-BR')}</div>
          </div>
          <div className="bg-[#0A0D14]/50 p-3 rounded-xl border border-white/5">
            <div className="text-xs text-[#A8B3CF] mb-1 flex items-center gap-1.5"><Coins className="w-3 h-3 text-emerald-400" /> Custo Mês</div>
            <div className="text-lg font-semibold text-emerald-400">{loading ? '...' : `U$ ${(stats?.cost_month || 0).toFixed(2)}`}</div>
          </div>
          <div className="bg-[#0A0D14]/50 p-3 rounded-xl border border-white/5">
            <div className="text-xs text-[#A8B3CF] mb-1 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Tempo Médio</div>
            <div className="text-lg font-semibold text-white">{loading ? '...' : `${stats?.avg_latency || 0} ms`}</div>
          </div>
        </div>

        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-[#A8B3CF]">Cota Diária (GPT-4)</span>
            <span className="text-white font-medium">65%</span>
          </div>
          <div className="w-full bg-[#0A0D14] rounded-full h-2 overflow-hidden border border-white/5">
            <div className="bg-gradient-to-r from-[#8B5CF6] to-[#C084FC] h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
