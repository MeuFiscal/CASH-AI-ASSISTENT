import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Smartphone, RefreshCw } from 'lucide-react';

interface AdminWhatsApp {
  id: string;
  workspace_name: string;
  phone_number: string;
  status: string;
  last_sync: string;
  last_message: string | null;
}

export function AdminWhatsApp() {
  const [accounts, setAccounts] = useState<AdminWhatsApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWhatsApp() {
      const { data, error } = await supabase.rpc('admin_get_whatsapp');
      if (!error && data) {
        setAccounts(data as AdminWhatsApp[]);
      }
      setLoading(false);
    }
    loadWhatsApp();
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">WhatsApp</h1>
          <p className="text-[#A8B3CF] mt-1 text-sm">Gerenciamento de conexões de WhatsApp.</p>
        </div>
        
        <div className="w-full border border-white/5 bg-[#181C28]/60 backdrop-blur-md rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#A8B3CF]">
              <thead className="bg-white/5 border-b border-white/5 text-white/70">
                <tr>
                  <th className="px-6 py-4 font-medium">Número</th>
                  <th className="px-6 py-4 font-medium">Workspace</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Última Sincronização</th>
                  <th className="px-6 py-4 font-medium">Última Mensagem</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[#A8B3CF]">
                      Carregando conexões...
                    </td>
                  </tr>
                ) : accounts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[#A8B3CF]">
                      Nenhum WhatsApp conectado.
                    </td>
                  </tr>
                ) : (
                  accounts.map(account => (
                    <tr key={account.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                            <Smartphone className="w-4 h-4 text-[#10B981]" />
                          </div>
                          <span className="text-white font-medium">{account.phone_number}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white/90 font-medium">{account.workspace_name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          account.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                          {account.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                           <RefreshCw className="w-3 h-3 text-[#A8B3CF]" />
                           {format(new Date(account.last_sync), "dd/MM/yy HH:mm", { locale: ptBR })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {account.last_message ? format(new Date(account.last_message), "dd/MM/yy HH:mm", { locale: ptBR }) : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
