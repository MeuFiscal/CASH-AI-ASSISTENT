import { useEffect, useState } from 'react';
import { AdminLayout } from './components/AdminLayout';
import { supabase } from '@/lib/supabase';
import { DashboardHero } from './pages/dashboard/components/DashboardHero';
import { KpiGrid } from './pages/dashboard/components/KpiGrid';
import { GrowthChart } from './pages/dashboard/components/GrowthChart';
import { SystemHealthPanel } from './pages/dashboard/components/SystemHealthPanel';
import { SmartAlerts } from './pages/dashboard/components/SmartAlerts';
import { TopWorkspacesTable } from './pages/dashboard/components/TopWorkspacesTable';
import { RecentEventsTimeline } from './pages/dashboard/components/RecentEventsTimeline';
import { AiUsageCard } from './pages/dashboard/components/AiUsageCard';
import { WhatsAppStats } from './pages/dashboard/components/WhatsAppStats';
import { FinancialPanel } from './pages/dashboard/components/FinancialPanel';
import { UsersMap } from './pages/dashboard/components/UsersMap';
import { IntelligenceCenter } from './pages/dashboard/components/intelligence/IntelligenceCenter';
import { useSmartPolling } from '@/hooks/useSmartPolling';

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [topWorkspaces, setTopWorkspaces] = useState<any[]>([]);
  const [mapData, setMapData] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      const { data, error } = await supabase.rpc('admin_get_kpis_v2');
      if (data && !error) setMetrics(data);
      
      // Simulate chart data for now
      setChartData([
        { date: '10/06', usuarios: 400, receita: 2400, workspaces: 24 },
        { date: '15/06', usuarios: 550, receita: 3200, workspaces: 35 },
        { date: '20/06', usuarios: 700, receita: 4500, workspaces: 50 },
        { date: '25/06', usuarios: 950, receita: 6800, workspaces: 72 },
        { date: '30/06', usuarios: 1200, receita: 9500, workspaces: 95 },
      ]);
      
      setAlerts([
        { id: '1', type: 'Sem pagamento', priority: 'Crítica', message: 'Workspace ACME sem assinatura ativa detectado.', date: new Date().toISOString() },
        { id: '2', type: 'Taxa de Erro WhatsApp', priority: 'Alta', message: 'Muitas mensagens falhando na fila 3.', date: new Date(Date.now() - 3600000).toISOString() },
      ]);

      setEvents([
        { id: '1', type: 'user_joined', title: 'Novo Usuário', description: 'João Silva criou uma conta.', date: '10 min atrás' },
        { id: '2', type: 'payment', title: 'Assinatura', description: 'Plano Pro assinado por TechCorp.', date: '1h atrás' },
        { id: '3', type: 'error', title: 'Erro de Webhook', description: 'Falha ao entregar evento para URL x.', date: '3h atrás' },
      ]);

      setTopWorkspaces([
        { id: '1', empresa: 'Acme Corp', plano: 'Enterprise', usuarios: 45, mensagens: 12000, tokens: 450000, receita: 4990.00, ultimo_acesso: '', status: 'Ativo' },
        { id: '2', empresa: 'Tech Solutions', plano: 'Pro', usuarios: 12, mensagens: 4500, tokens: 120000, receita: 990.00, ultimo_acesso: '', status: 'Ativo' },
      ]);

      setMapData([
        { uf: 'SP', workspaces: 45, receita: 12500, usuarios: 230 },
        { uf: 'RJ', workspaces: 20, receita: 4500, usuarios: 85 },
        { uf: 'MG', workspaces: 15, receita: 3200, usuarios: 60 },
        { uf: 'SC', workspaces: 8, receita: 1800, usuarios: 35 },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useSmartPolling(fetchDashboardData, 15000);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
        <DashboardHero />
        <KpiGrid metrics={metrics} loading={loading} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <GrowthChart data={chartData} loading={loading} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FinancialPanel stats={metrics} loading={loading} />
              <UsersMap data={mapData} loading={loading} />
            </div>
            <TopWorkspacesTable workspaces={topWorkspaces} loading={loading} />
            
            {/* Centro de Inteligência agora é o destaque final ocupando 2 colunas */}
            <div className="mt-2">
              <IntelligenceCenter />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <SystemHealthPanel loading={loading} />
            <SmartAlerts alerts={alerts} loading={loading} />
            <RecentEventsTimeline events={events} loading={loading} />
            <AiUsageCard stats={metrics} loading={loading} />
            <WhatsAppStats stats={metrics} loading={loading} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

