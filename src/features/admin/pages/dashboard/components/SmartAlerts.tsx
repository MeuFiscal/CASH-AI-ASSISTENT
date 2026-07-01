import { AlertTriangle, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Alert {
  id: string;
  type: string;
  priority: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  message: string;
  date: string;
}

export function SmartAlerts({ alerts, loading }: { alerts: Alert[], loading: boolean }) {
  const getPriorityConfig = (priority: Alert['priority']) => {
    switch (priority) {
      case 'Crítica': return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: ShieldAlert };
      case 'Alta': return { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: AlertTriangle };
      case 'Média': return { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Info };
      case 'Baixa': return { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Info };
      default: return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2 };
    }
  };

  return (
    <div className="bg-[#181C28]/60 border border-white/5 backdrop-blur-md rounded-2xl p-5 w-full flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">Alertas Inteligentes</h3>
          <p className="text-xs text-[#A8B3CF]">Requerem atenção do administrador</p>
        </div>
        <div className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full text-xs font-semibold">
          {alerts?.length || 0} ativos
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-2 h-[300px] overflow-y-auto pr-1 custom-scrollbar">
        {loading ? (
          <div className="text-sm text-[#A8B3CF]">Carregando alertas...</div>
        ) : alerts?.length === 0 ? (
          <div className="text-sm text-[#A8B3CF] text-center mt-10 flex flex-col items-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
            Nenhum alerta ativo
          </div>
        ) : (
          alerts.map((alert) => {
            const config = getPriorityConfig(alert.priority);
            const Icon = config.icon;
            return (
              <div key={alert.id} className={`flex items-start justify-between p-3 rounded-xl border ${config.bg} ${config.border}`}>
                <div className="flex gap-3">
                  <Icon className={`w-5 h-5 mt-0.5 ${config.color}`} />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-white">{alert.type}</span>
                    <span className="text-xs text-[#A8B3CF]">{alert.message}</span>
                    <span className="text-[10px] text-[#A8B3CF] opacity-70 mt-1">{new Date(alert.date).toLocaleString('pt-BR')}</span>
                  </div>
                </div>
                <button className="text-[10px] font-medium bg-[#181C28] hover:bg-[#202534] border border-white/10 text-white px-2 py-1 rounded transition-colors whitespace-nowrap">
                  Resolver
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
