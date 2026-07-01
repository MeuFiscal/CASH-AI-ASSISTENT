import { MapPin } from 'lucide-react';

interface StateData {
  uf: string;
  workspaces: number;
  receita: number;
  usuarios: number;
}

export function UsersMap({ data, loading }: { data: StateData[], loading: boolean }) {
  // Encontrar o valor máximo para calcular a porcentagem da barra
  const maxWorkspaces = data?.reduce((max, item) => item.workspaces > max ? item.workspaces : max, 0) || 1;

  return (
    <div className="bg-[#181C28]/60 border border-white/5 backdrop-blur-md rounded-2xl p-5 w-full flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-400" />
        <h3 className="text-white font-medium">Distribuição Geográfica</h3>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {loading ? (
          <div className="text-sm text-[#A8B3CF] py-4">Carregando mapa...</div>
        ) : data?.length === 0 ? (
          <div className="text-sm text-[#A8B3CF] py-4">Sem dados de localização</div>
        ) : (
          data?.map((state) => {
            const percentage = Math.max(5, (state.workspaces / maxWorkspaces) * 100);
            
            return (
              <div key={state.uf} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white font-medium">{state.uf}</span>
                  <div className="flex gap-3 text-xs">
                    <span className="text-[#A8B3CF]">{state.workspaces} wksp</span>
                    <span className="text-emerald-400">R$ {state.receita.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
                  </div>
                </div>
                <div className="w-full bg-[#0A0D14] rounded-full h-1.5 overflow-hidden border border-white/5">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
