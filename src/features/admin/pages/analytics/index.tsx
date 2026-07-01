import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { PageHeader } from '../../../../components/PageHeader';
import { LineChart, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AdminAnalytic {
  date: string;
  conversations: number;
  messages: number;
}

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AdminAnalytic[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadAnalytics() {
      const { data, error } = await supabase.rpc('admin_get_analytics');
      if (error) {
        console.error('Error in admin_get_analytics:', error);
        setErrorMsg(error.message || 'Erro desconhecido ao carregar analytics.');
      } else if (data) {
        setAnalytics(data as AdminAnalytic[]);
      }
      setLoading(false);
    }

    loadAnalytics();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <PageHeader
        icon={LineChart}
        title="Analytics"
        subtitle="Métricas diárias de conversas e mensagens (últimos 30 dias)."
      />

      <div className="bg-[#0B0F19] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-sm font-semibold text-[#A8B3CF]">
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Conversas Únicas</th>
                <th className="px-6 py-4">Mensagens Trocadas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-transparent">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-[#A8B3CF]">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCw className="w-6 h-6 text-[#A8B3CF] animate-spin" />
                      Carregando analytics...
                    </div>
                  </td>
                </tr>
              ) : errorMsg ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-red-500">
                    Erro da API: {errorMsg}
                  </td>
                </tr>
              ) : analytics.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-[#A8B3CF]">
                    Nenhum dado encontrado nos últimos 30 dias.
                  </td>
                </tr>
              ) : (
                analytics.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-white/[0.02] transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#A8B3CF]">
                          <LineChart className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-white">
                          {format(new Date(item.date), "dd 'de' MMM, yyyy", { locale: ptBR })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#A8B3CF]">{item.conversations}</td>
                    <td className="px-6 py-4 text-[#A8B3CF]">{item.messages}</td>
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
