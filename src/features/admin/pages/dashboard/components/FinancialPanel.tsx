import { DollarSign, TrendingUp, TrendingDown, Users, BarChart3, Wallet } from 'lucide-react';

export function FinancialPanel({ stats, loading }: { stats: any, loading: boolean }) {
  const metrics = [
    { label: 'ARR (Anual)', value: `R$ ${(stats?.arr || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'ARPU (Ticket Médio)', value: `R$ ${(stats?.arpu || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-[#8B5CF6]' },
    { label: 'LTV Estimado', value: `R$ ${(stats?.ltv || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: Wallet, color: 'text-blue-400' },
    { label: 'CAC Estimado', value: `R$ ${(stats?.cac || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: Users, color: 'text-orange-400' },
    { label: 'Churn Rate', value: `${(stats?.churn || 0)}%`, icon: TrendingDown, color: 'text-red-400' },
  ];

  return (
    <div className="bg-[#181C28]/60 border border-white/5 backdrop-blur-md rounded-2xl p-5 w-full flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-emerald-400" />
        <h3 className="text-white font-medium">Saúde Financeira SaaS</h3>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#0A0D14]/50 border border-white/5 hover:bg-[#181C28] transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white/5 ${metric.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm text-[#A8B3CF]">{metric.label}</span>
              </div>
              <span className="font-semibold text-white">{loading ? '...' : metric.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
