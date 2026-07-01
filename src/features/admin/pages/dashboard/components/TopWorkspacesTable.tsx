import { Building2, ArrowUpRight } from 'lucide-react';

interface TopWorkspace {
  id: string;
  empresa: string;
  plano: string;
  usuarios: number;
  mensagens: number;
  tokens: number;
  receita: number;
  ultimo_acesso: string;
  status: string;
}

export function TopWorkspacesTable({ workspaces, loading }: { workspaces: TopWorkspace[], loading: boolean }) {
  return (
    <div className="bg-[#181C28]/60 border border-white/5 backdrop-blur-md rounded-2xl p-5 w-full flex flex-col gap-4 animate-in fade-in duration-500 overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#8B5CF6]" />
          <h3 className="text-white font-medium">Top Workspaces</h3>
        </div>
        <button className="text-xs text-[#8B5CF6] hover:text-[#7C3AED] flex items-center gap-1 transition-colors">
          Ver todos <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      <div className="overflow-x-auto custom-scrollbar pb-2">
        <table className="w-full text-left text-sm text-[#A8B3CF]">
          <thead className="text-xs text-[#A8B3CF] uppercase bg-[#0A0D14]/50 border-b border-white/5">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Empresa</th>
              <th className="px-4 py-3">Plano</th>
              <th className="px-4 py-3 text-center">Usuários</th>
              <th className="px-4 py-3 text-right">Tokens AI</th>
              <th className="px-4 py-3 text-right">Receita (MRR)</th>
              <th className="px-4 py-3 rounded-tr-lg">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-sm">Carregando dados...</td>
              </tr>
            ) : workspaces?.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-sm">Nenhum workspace encontrado</td>
              </tr>
            ) : (
              workspaces?.map((ws) => (
                <tr key={ws.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium text-white whitespace-nowrap">{ws.empresa}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="bg-[#8B5CF6]/10 text-[#8B5CF6] px-2 py-0.5 rounded text-[10px] font-semibold border border-[#8B5CF6]/20">
                      {ws.plano || 'Free'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{ws.usuarios}</td>
                  <td className="px-4 py-3 text-right">{ws.tokens.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3 text-right text-emerald-400 font-medium">
                    R$ {ws.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold flex w-max items-center gap-1.5 ${
                      ws.status === 'Ativo' ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${ws.status === 'Ativo' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      {ws.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
