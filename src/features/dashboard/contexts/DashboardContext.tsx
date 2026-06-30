import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { DashboardData, DashboardStateStatus } from '../types/dashboard';
import { DashboardService } from '../services/DashboardService';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardContextData {
  data: DashboardData | null;
  status: DashboardStateStatus;
  refreshDashboard: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextData>({} as DashboardContextData);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [status, setStatus] = useState<DashboardStateStatus>('loading');

  const loadData = async (isBackgroundRefresh = false) => {
    if (!user) return;
    
    if (!isBackgroundRefresh) {
      setStatus('loading');
    }

    // Default workspace logic: if we had a proper user-workspace mapping in auth context, 
    // we would use it here. For now we use a hardcoded or derived one, or we fetch the first one.
    // Assuming user default workspace fetching will happen in service or here.
    // We'll pass the user.id to the service to find the default workspace if needed, 
    // but the RPC build_dashboard expects p_workspace_id. 
    
    // We'll query the first workspace of the user to get an ID.
    const { data: workspaces } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .limit(1);

    const workspaceId = workspaces?.[0]?.workspace_id;

    if (!workspaceId) {
      setStatus('empty');
      return;
    }

    const res = await DashboardService.getDashboardData(workspaceId);

    if (res.error) {
      setStatus('error');
      return;
    }

    if (res.data) {
      // Logic for Empty State
      const isEmpty = 
        res.data.financial.balance === 0 &&
        res.data.financial.income_today === 0 &&
        res.data.financial.expense_today === 0 &&
        res.data.agenda.length === 0 &&
        res.data.whatsapp.length === 0;

      if (isEmpty) {
        res.data.status = 'empty';
        setData(res.data);
        setStatus('empty');
      } else {
        res.data.status = 'ready';
        setData(res.data);
        setStatus('ready');
      }
    }
  };

  useEffect(() => {
    loadData();

    if (!user) return;

    // Realtime Subscriptions
    const channel = supabase.channel('dashboard_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
        loadData(true);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'calendar_events' }, () => {
        loadData(true);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'whatsapp_messages' }, () => {
        loadData(true);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <DashboardContext.Provider value={{ data, status, refreshDashboard: () => loadData() }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
