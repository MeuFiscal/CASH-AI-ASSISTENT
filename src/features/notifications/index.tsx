import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Bell, AlertTriangle, Info, CheckCircle2, CheckCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

function getIcon(type: string) {
  switch (type) {
    case 'success': return { icon: CheckCircle2, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10' };
    case 'warning': return { icon: AlertTriangle, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' };
    case 'error': return { icon: AlertTriangle, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' };
    case 'info': 
    default: return { icon: Info, color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10' };
  }
}

export function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, [user]);

  async function loadNotifications() {
    if (!user?.id) return;
    const { data: ws } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!ws?.workspace_id) return;

    const { data: notifs } = await supabase
      .from('notifications')
      .select('*')
      .eq('workspace_id', ws.workspace_id)
      .order('created_at', { ascending: false });

    setNotifications(notifs || []);
    setLoading(false);
  }

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;
    const { data: ws } = await supabase.from('workspace_members').select('workspace_id').eq('user_id', user.id).maybeSingle();
    if (!ws?.workspace_id) return;

    await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('workspace_id', ws.workspace_id).is('read_at', null);
    setNotifications(prev => prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
  };

  const deleteNotification = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <DashboardLayout>
      <PageContainer>
        
        <PageHeader 
          icon={Bell}
          title="Notificações"
          subtitle="Avisos e alertas do seu assistente."
          actions={
            notifications.length > 0 && notifications.some(n => !n.read_at) && (
              <button 
                onClick={markAllAsRead}
                className="text-[13px] font-medium text-[#3B82F6] hover:text-white transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Marcar todas como lidas
              </button>
            )
          }
        />

        {!loading && notifications.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-[#3B82F6]/10 flex items-center justify-center mb-6 border border-[#3B82F6]/20">
              <Bell className="w-10 h-10 text-[#3B82F6] opacity-80" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Você ainda não possui notificações.</h2>
            <p className="text-[#A8B3CF] w-full max-w-md mx-auto min-w-[300px]">A IA avisará aqui quando houver algo importante ou novidades no sistema.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 w-full">
            {notifications.map((notif) => {
              const style = getIcon(notif.type);
              const isRead = !!notif.read_at;
              return (
                <div 
                  key={notif.id}
                  onClick={() => !isRead && markAsRead(notif.id)}
                  className={cn(
                    "p-4 sm:p-5 rounded-2xl border transition-all flex items-start sm:items-center gap-4 relative group cursor-pointer",
                    !isRead 
                      ? "bg-[#181C28]/80 border-white/10 hover:bg-[#181C28]" 
                      : "bg-white/5 border-transparent hover:bg-white/10 opacity-70 hover:opacity-100"
                  )}
                >
                  {!isRead && (
                    <div className="absolute top-1/2 -translate-y-1/2 left-2 w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                  )}
                  
                  <div className={cn("p-2.5 rounded-xl shrink-0 mt-1 sm:mt-0 ml-4", style.bg)}>
                    <style.icon className={cn("w-5 h-5", style.color)} />
                  </div>
                  
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 pr-10">
                    <div>
                      <h3 className={cn("text-[15px] font-semibold tracking-wide mb-1", !isRead ? "text-white" : "text-[#E2E8F0]")}>
                        {notif.title}
                      </h3>
                      <p className="text-[#A8B3CF] text-[14px] leading-relaxed">
                        {notif.content}
                      </p>
                    </div>
                    <span className="text-[12px] text-[#A8B3CF]/70 font-medium shrink-0 whitespace-nowrap">
                      {new Date(notif.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[#A8B3CF] hover:text-[#EF4444] hover:bg-[#EF4444]/10 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </PageContainer>
    </DashboardLayout>
  );
}
