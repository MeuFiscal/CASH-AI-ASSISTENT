import { useState, useEffect } from 'react';
import { supabase } from '../../../../core/supabase/client';
import { PageHeader } from '../../../../core/components/PageHeader';
import { CreditCard, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AdminSubscription {
  id: string;
  workspace_name: string;
  plan_name: string;
  status: string;
  current_period_end: string;
  price: number;
  created_at: string;
}

export function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadSubscriptions() {
      const { data, error } = await supabase.rpc('admin_get_subscriptions');
      if (error) {
        console.error('Error in admin_get_subscriptions:', error);
        setErrorMsg(error.message || 'Erro desconhecido ao carregar assinaturas.');
      } else if (data) {
        setSubscriptions(data as AdminSubscription[]);
      }
      setLoading(false);
    }

    loadSubscriptions();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Assinaturas"
        description="Gerenciamento de assinaturas e planos."
      />

      <div className="bg-[#0B0F19] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-sm font-semibold text-[#A8B3CF]">
                <th className="px-6 py-4">Workspace</th>
                <th className="px-6 py-4">Plano</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Vencimento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-transparent">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#A8B3CF]">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCw className="w-6 h-6 text-[#A8B3CF] animate-spin" />
                      Carregando assinaturas...
                    </div>
                  </td>
                </tr>
              ) : errorMsg ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-red-500">
                    Erro da API: {errorMsg}
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#A8B3CF]">
                    Nenhuma assinatura encontrada.
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-white/[0.02] transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#A8B3CF]">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-white">{sub.workspace_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#A8B3CF]">{sub.plan_name}</td>
                    <td className="px-6 py-4 text-[#A8B3CF]">
                      R$ {sub.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          sub.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : sub.status === 'TRIALING'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#A8B3CF]">
                      {sub.current_period_end ? format(new Date(sub.current_period_end), "dd 'de' MMM, yyyy", { locale: ptBR }) : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
