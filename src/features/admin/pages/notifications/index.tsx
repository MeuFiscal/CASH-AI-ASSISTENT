import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { PageHeader } from '../../../../components/PageHeader';
import { Bell, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AdminNotification {
  id: string;
  title: string;
  type: string;
  status: string;
  created_at: string;
}

export function AdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadNotifications() {
      const { data, error } = await supabase.rpc('admin_get_notifications');
      if (error) {
        console.error('Error in admin_get_notifications:', error);
        setErrorMsg(error.message || 'Erro desconhecido ao carregar notificações.');
      } else if (data) {
        setNotifications(data as AdminNotification[]);
      }
      setLoading(false);
    }

    loadNotifications();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <PageHeader
        icon={Bell}
        title="Notificações Globais"
        subtitle="Histórico das últimas 100 notificações disparadas pelo sistema."
      />

      <div className="bg-[#0B0F19] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-sm font-semibold text-[#A8B3CF]">
                <th className="px-6 py-4">Título</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-transparent">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#A8B3CF]">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCw className="w-6 h-6 text-[#A8B3CF] animate-spin" />
                      Carregando notificações...
                    </div>
                  </td>
                </tr>
              ) : errorMsg ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-red-500">
                    Erro da API: {errorMsg}
                  </td>
                </tr>
              ) : notifications.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#A8B3CF]">
                    Nenhuma notificação encontrada.
                  </td>
                </tr>
              ) : (
                notifications.map((notif) => (
                  <tr
                    key={notif.id}
                    className="hover:bg-white/[0.02] transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#A8B3CF]">
                          <Bell className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-white">{notif.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#A8B3CF]">
                      <span className="px-2 py-1 bg-white/5 rounded-full text-xs">
                        {notif.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          notif.status === 'read'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {notif.status === 'read' ? 'Lida' : 'Não lida'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#A8B3CF]">
                      {format(new Date(notif.created_at), "dd 'de' MMM, yyyy HH:mm", { locale: ptBR })}
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
