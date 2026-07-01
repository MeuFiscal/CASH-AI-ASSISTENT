import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AdminWorkspace {
  id: string;
  name: string;
  slug: string;
  status: string;
  created_at: string;
  owner_email: string;
  owner_name: string;
  member_count: number;
  plan_name: string;
}

export function AdminWorkspaces() {
  const [workspaces, setWorkspaces] = useState<AdminWorkspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkspaces() {
      const { data, error } = await supabase.rpc('admin_get_workspaces');
      if (!error && data) {
        setWorkspaces(data as AdminWorkspace[]);
      }
      setLoading(false);
    }
    loadWorkspaces();
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Workspaces</h1>
          <p className="text-[#A8B3CF] mt-1 text-sm">Gerenciamento de workspaces e membros.</p>
        </div>
        
        <div className="w-full border border-white/5 bg-[#181C28]/60 backdrop-blur-md rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#A8B3CF]">
              <thead className="bg-white/5 border-b border-white/5 text-white/70">
                <tr>
                  <th className="px-6 py-4 font-medium">Workspace</th>
                  <th className="px-6 py-4 font-medium">Proprietário</th>
                  <th className="px-6 py-4 font-medium">Plano</th>
                  <th className="px-6 py-4 font-medium">Membros</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Criado em</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[#A8B3CF]">
                      Carregando workspaces...
                    </td>
                  </tr>
                ) : workspaces.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[#A8B3CF]">
                      Nenhum workspace encontrado.
                    </td>
                  </tr>
                ) : (
                  workspaces.map(ws => (
                    <tr key={ws.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{ws.name}</span>
                          <span className="text-xs text-[#A8B3CF]">/{ws.slug}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{ws.owner_name}</span>
                          <span className="text-xs text-[#A8B3CF]">{ws.owner_email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white/90 font-medium">{ws.plan_name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white/90 font-medium">{ws.member_count}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          ws.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {ws.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {format(new Date(ws.created_at), "dd 'de' MMM, yyyy", { locale: ptBR })}
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
