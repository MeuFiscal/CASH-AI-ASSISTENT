import { useEffect, useState } from 'react';
import { AdminLayout } from './components/AdminLayout';
import { Users, Building2, Wallet, BrainCircuit } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Metrics {
  total_users: number;
  active_users: number;
  workspaces: number;
  conversations_today: number;
  whatsapp_messages: number;
  mrr: number;
  active_subscriptions: number;
  ai_tokens_used: number;
  edge_functions_status: string;
  database_status: string;
}

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      const { data, error } = await supabase.rpc('admin_get_metrics');
      if (error) {
        console.error('Error fetching admin_get_metrics:', error);
      } else if (data) {
        setMetrics(data as Metrics);
      }
      setLoading(false);
    }
    loadMetrics();
  }, []);

  const statCards = [
    {
      title: 'Usuários Ativos',
      value: loading ? '...' : String(metrics?.total_users || 0),
      trend: '+0%',
      icon: Users,
      color: 'text-[#3B82F6]'
    },
    {
      title: 'Workspaces',
      value: loading ? '...' : String(metrics?.workspaces || 0),
      trend: '',
      icon: Building2,
      color: 'text-[#10B981]'
    },
    {
      title: 'Receita MRR',
      value: loading ? '...' : `R$ ${(metrics?.mrr || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      trend: '',
      icon: Wallet,
      color: 'text-[#F59E0B]'
    },
    {
      title: 'Tokens OpenAI',
      value: loading ? '...' : String(metrics?.ai_tokens_used || 0),
      trend: 'total',
      icon: BrainCircuit,
      color: 'text-[#8B5CF6]'
    }
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
        
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Centro de Operações</h1>
          <p className="text-[#A8B3CF] mt-1 text-sm">Visão geral do sistema e indicadores de saúde da plataforma.</p>
        </div>

        {/* Indicadores Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-[#181C28]/60 border border-white/5 backdrop-blur-md rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-[#A8B3CF]">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-sm font-medium">{stat.title}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-white">{stat.value}</span>
                  {stat.trend && (
                    <span className="text-sm text-green-400 font-medium mb-1">{stat.trend}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </AdminLayout>
  );
}
