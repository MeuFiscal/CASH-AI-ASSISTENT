import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BrainCircuit, Activity } from 'lucide-react';

interface AdminOpenAIUsage {
  tokens_in: number;
  tokens_out: number;
  tokens_total: number;
  estimated_cost_brl: number;
  models_used: string;
  last_execution: string | null;
  history: Array<{ date: string; tokens: number }>;
}

export function AdminOpenAI() {
  const [usage, setUsage] = useState<AdminOpenAIUsage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsage() {
      const { data, error } = await supabase.rpc('admin_get_openai_usage');
      if (!error && data) {
        setUsage(data as AdminOpenAIUsage);
      }
      setLoading(false);
    }
    loadUsage();
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">OpenAI (Consumo)</h1>
          <p className="text-[#A8B3CF] mt-1 text-sm">Monitoramento de custos e tokens via banco de dados.</p>
        </div>
        
        {loading ? (
          <div className="w-full h-32 border border-white/5 bg-[#181C28]/60 backdrop-blur-md rounded-2xl flex items-center justify-center">
            <span className="text-[#A8B3CF] font-medium">Carregando métricas...</span>
          </div>
        ) : !usage ? (
           <div className="w-full h-32 border border-white/5 bg-[#181C28]/60 backdrop-blur-md rounded-2xl flex items-center justify-center">
            <span className="text-[#A8B3CF] font-medium">Erro ao carregar métricas.</span>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#181C28]/60 border border-white/5 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-[#A8B3CF]">
                  <BrainCircuit className="w-5 h-5 text-[#8B5CF6]" />
                  <span className="text-sm font-medium">Tokens Totais</span>
                </div>
                <span className="text-3xl font-bold text-white">{usage.tokens_total.toLocaleString('pt-BR')}</span>
              </div>
              
              <div className="bg-[#181C28]/60 border border-white/5 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-[#A8B3CF]">
                  <Activity className="w-5 h-5 text-[#F59E0B]" />
                  <span className="text-sm font-medium">Custo Estimado</span>
                </div>
                <span className="text-3xl font-bold text-white">
                  R$ {usage.estimated_cost_brl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </span>
              </div>

              <div className="bg-[#181C28]/60 border border-white/5 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-[#A8B3CF]">
                  <span className="text-sm font-medium">Tokens (Entrada)</span>
                </div>
                <span className="text-3xl font-bold text-white">{usage.tokens_in.toLocaleString('pt-BR')}</span>
              </div>

              <div className="bg-[#181C28]/60 border border-white/5 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-[#A8B3CF]">
                  <span className="text-sm font-medium">Tokens (Saída)</span>
                </div>
                <span className="text-3xl font-bold text-white">{usage.tokens_out.toLocaleString('pt-BR')}</span>
              </div>
            </div>

            {/* Details */}
            <div className="bg-[#181C28]/60 border border-white/5 backdrop-blur-md rounded-2xl p-6">
               <h3 className="text-lg font-medium text-white mb-4">Detalhes da Integração</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#A8B3CF] mb-1">Modelo Principal</p>
                    <p className="text-white font-medium">{usage.models_used}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#A8B3CF] mb-1">Última Execução</p>
                    <p className="text-white font-medium">
                      {usage.last_execution ? format(new Date(usage.last_execution), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : 'Nunca'}
                    </p>
                  </div>
               </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
