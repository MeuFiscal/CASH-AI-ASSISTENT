
import { Users, Building2, Wallet, BrainCircuit, Activity, Server, MessageCircle, BarChart } from 'lucide-react';

export function KpiGrid({ metrics, loading }: { metrics: any, loading: boolean }) {
  const statCards = [
    { title: 'Usuários Ativos', value: metrics?.users?.active || 0, trend: '+12%', icon: Users, color: 'text-[#3B82F6]' },
    { title: 'Workspaces', value: metrics?.workspaces?.total || 0, trend: '+5%', icon: Building2, color: 'text-[#10B981]' },
    { title: 'Assinantes Premium', value: metrics?.premium_subs || 0, trend: '+8%', icon: Activity, color: 'text-[#F59E0B]' },
    { title: 'Receita MRR', value: `R$ ${(metrics?.mrr || 0).toLocaleString('pt-BR')}`, trend: '+15%', icon: Wallet, color: 'text-[#8B5CF6]' },
    { title: 'Receita Total', value: `R$ ${(metrics?.revenue || 0).toLocaleString('pt-BR')}`, trend: '+20%', icon: BarChart, color: 'text-[#EC4899]' },
    { title: 'Tokens OpenAI Hoje', value: metrics?.tokens_today || 0, trend: '+2%', icon: BrainCircuit, color: 'text-[#06B6D4]' },
    { title: 'Mensagens WhatsApp', value: metrics?.messages_today || 0, trend: '+18%', icon: MessageCircle, color: 'text-[#22C55E]' },
    { title: 'Chamadas API Hoje', value: metrics?.api_calls || 0, trend: '+10%', icon: Server, color: 'text-[#6366F1]' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {statCards.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="bg-[#181C28]/60 border border-white/5 backdrop-blur-md rounded-2xl p-4 flex flex-col gap-3 hover:bg-[#181C28]/80 transition-colors">
            <div className="flex items-center gap-3 text-[#A8B3CF]">
              <Icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs font-medium">{stat.title}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-white">{loading ? '...' : stat.value}</span>
              <span className="text-xs text-green-400 font-medium mb-1">{stat.trend}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
