import { supabase } from '@/lib/supabase';
import type { DashboardData, DashboardServiceResponse } from '../types/dashboard';

export class DashboardService {
  /**
   * Loads the complete dashboard state from Supabase RPC.
   * Protects the frontend from knowing database specifics.
   */
  static async getDashboardData(workspaceId: string): Promise<DashboardServiceResponse> {
    try {
      const { data, error } = await supabase.rpc('build_dashboard', {
        p_workspace_id: workspaceId
      });

      if (error) {
        console.error('Error in build_dashboard RPC:', error);
        return { data: null, error: new Error(error.message) };
      }

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [{ data: transactions, error: transactionsError }, { data: accounts, error: accountsError }] = await Promise.all([
        supabase
        .from('transactions')
        .select('amount, type, date, status')
        .eq('workspace_id', workspaceId)
        .eq('status', 'completed'),
        supabase.from('accounts').select('balance').eq('workspace_id', workspaceId),
      ]);

      if (transactionsError || accountsError) {
        return { data: null, error: new Error(transactionsError?.message || accountsError?.message || 'Falha ao carregar finanças') };
      }

      const realBalance = (accounts || []).reduce((total, account) => total + Number(account.balance), 0);
      let incomeToday = 0;
      let expenseToday = 0;

      if (transactions) {
        transactions.forEach(tx => {
          if (tx.type === 'income') {
            if (new Date(tx.date) >= todayStart) incomeToday += Number(tx.amount);
          } else {
            if (new Date(tx.date) >= todayStart) expenseToday += Number(tx.amount);
          }
        });
      }

      // Buscar agenda atualizada
      const { data: agenda, error: agendaError } = await supabase
        .from('calendar_events')
        .select('id, title, start_time')
        .eq('workspace_id', workspaceId)
        .gte('start_time', todayStart.toISOString())
        .order('start_time', { ascending: true })
        .limit(5);

      if (agendaError) return { data: null, error: new Error(agendaError.message) };

      const dashboardData: DashboardData = {
        status: 'ready',
        workspace: data.workspace || { id: workspaceId, name: 'Meu Workspace', plan: 'premium' },
        financial: { 
          balance: realBalance, 
          income_today: incomeToday, 
          expense_today: expenseToday 
        },
        agenda: agenda ? agenda.map(a => ({ id: a.id, title: a.title, time: a.start_time })) : [],
        priorities: data.priorities || [],
        memory: data.memory || {},
        insights: data.insights || {},
        documents: data.documents || {},
        notifications: data.notifications || {},
        last_update: new Date().toISOString(),
        next_refresh: new Date(Date.now() + 5 * 60000).toISOString(),
        version: 1
      };

      return { data: dashboardData, error: null };
    } catch (err: any) {
      console.error('Unexpected error loading dashboard:', err);
      return { data: null, error: err };
    }
  }
}
