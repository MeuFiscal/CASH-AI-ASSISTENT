
import { Plus, Users, MessageSquare, CreditCard, Database, ShieldAlert } from 'lucide-react';

export function DashboardHero() {
  const actions = [
    { label: 'Novo Workspace', icon: Plus, onClick: () => {} },
    { label: 'Novo Usuário', icon: Users, onClick: () => {} },
    { label: 'Conectar WhatsApp', icon: MessageSquare, onClick: () => {} },
    { label: 'Adicionar Crédito', icon: CreditCard, onClick: () => {} },
    { label: 'Abrir Logs', icon: Database, onClick: () => {} },
    { label: 'Ver Auditoria', icon: ShieldAlert, onClick: () => {} },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 w-full animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-semibold text-white tracking-tight">Centro de Operações</h1>
        <div className="text-[#A8B3CF] mt-2 text-sm flex flex-col gap-1">
          <p>Sistema operando normalmente. Todos os serviços online.</p>
          <div className="flex gap-4 text-xs font-medium text-white/50 mt-1">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 5 Workspaces</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 0 Incidentes Críticos</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <button
              key={i}
              onClick={action.onClick}
              className="flex items-center gap-2 bg-[#181C28]/60 hover:bg-[#202534] border border-white/5 text-xs text-white px-3 py-2 rounded-lg transition-colors"
            >
              <Icon className="w-3.5 h-3.5 text-[#A8B3CF]" />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
