import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  plan_name: string;
  last_login: string;
  created_at: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      const { data, error } = await supabase.rpc('admin_get_users');
      if (error) {
        console.error('Error in admin_get_users:', error);
        setErrorMsg(error.message || 'Erro desconhecido ao carregar usuários.');
      } else if (data) {
        setUsers(data as AdminUser[]);
      }
      setLoading(false);
    }
    loadUsers();
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Usuários</h1>
          <p className="text-[#A8B3CF] mt-1 text-sm">Gerenciamento de usuários.</p>
        </div>
        
        <div className="w-full border border-white/5 bg-[#181C28]/60 backdrop-blur-md rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#A8B3CF]">
              <thead className="bg-white/5 border-b border-white/5 text-white/70">
                <tr>
                  <th className="px-6 py-4 font-medium">Usuário</th>
                  <th className="px-6 py-4 font-medium">Papel</th>
                  <th className="px-6 py-4 font-medium">Plano</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Cadastro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-transparent">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[#A8B3CF]">
                      Carregando usuários...
                    </td>
                  </tr>
                ) : errorMsg ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-red-500">
                      Erro da API: {errorMsg}
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[#A8B3CF]">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{user.name}</span>
                          <span className="text-xs text-[#A8B3CF]">{user.email}</span>
                          {user.phone && <span className="text-xs text-[#A8B3CF]">{user.phone}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          user.role === 'super_admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                          user.role === 'admin' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-white/5 text-white/70 border-white/10'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white/90 font-medium">{user.plan_name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          user.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {format(new Date(user.created_at), "dd 'de' MMM, yyyy", { locale: ptBR })}
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
