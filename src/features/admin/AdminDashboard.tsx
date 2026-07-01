import { useEffect, useState } from 'react';
import { AdminLayout } from './components/AdminLayout';
import { supabase } from '@/lib/supabase';
import { DashboardHero } from './pages/dashboard/components/DashboardHero';
import { KpiGrid } from './pages/dashboard/components/KpiGrid';
import { GrowthChart } from './pages/dashboard/components/GrowthChart';
import { SystemHealthPanel } from './pages/dashboard/components/SystemHealthPanel';
import { useSmartPolling } from '@/hooks/useSmartPolling';

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

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
          <div className="lg:col-span-2">
            <GrowthChart data={chartData} loading={loading} />
          </div>
          <div>
            <SystemHealthPanel loading={loading} />
          </div>
        </div>
        
        {/* Placeholder for future panels */}
      </div>
    </AdminLayout>
  );
}

