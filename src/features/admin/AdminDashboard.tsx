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
      // Real data fetching via RPCs
      const [
        { data: kpis },
        { data: chart },
        { data: alertsData },
        { data: eventsData },
        { data: workspacesData },
        { data: mapDataRes }
      ] = await Promise.all([
        supabase.rpc('admin_get_kpis_v2'),
        supabase.rpc('admin_get_growth_chart', { p_period: '30d' }),
        supabase.rpc('admin_get_smart_alerts'),
        supabase.rpc('admin_get_recent_events', { p_limit: 15 }),
        supabase.rpc('admin_get_top_workspaces'),
        supabase.rpc('admin_get_users_map')
      ]);

      if (kpis) setMetrics(kpis);
      if (chart) setChartData(chart);
      if (alertsData) setAlerts(alertsData);
      if (eventsData) setEvents(eventsData);
      if (workspacesData) setTopWorkspaces(workspacesData);
      if (mapDataRes) setMapData(mapDataRes);
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

