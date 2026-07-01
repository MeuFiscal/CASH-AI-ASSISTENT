import { useEffect, useState, useCallback } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { supabase } from '@/lib/supabase';
import { 
  Search, MoreVertical, Shield, CreditCard, 
  Trash2, Smartphone, ChevronLeft, 
  ChevronRight, Building2, Eye, Ban, CheckCircle, Upload, Key, LogIn
} from 'lucide-react';
import { UserDrawer } from './components/UserDrawer';
import { RoleModal, PlanModal, BlockModal, SoftDeleteModal } from './components/ActionModals';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  plan_name: string;
  whatsapp_status: string;
  workspace_name: string;
  last_login_at: string;
  created_at: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filtering State
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [filters] = useState<{ status?: string; role?: string }>({});
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDir] = useState<'asc' | 'desc'>('desc');
  
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUserForDrawer, setSelectedUserForDrawer] = useState<string | null>(null);

  // Modals state
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{
    type: 'role' | 'plan' | 'block' | 'delete' | null;
    user: AdminUser | null;
  }>({ type: null, user: null });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('admin_get_users', {
      p_search: search,
      p_filters: filters,
      p_page: page,
      p_limit: limit,
      p_sort_by: sortBy,
      p_sort_dir: sortDir
    });

    if (error) {
      console.error('Error fetching users:', error);
    } else if (data) {
      setUsers(data.data || []);
      setTotal(data.meta?.total || 0);
    }
    setLoading(false);
  }, [search, filters, page, limit, sortBy, sortDir]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1); // Reset page on new search
      loadUsers();
    }, 500);
    return () => clearTimeout(handler);
  }, [search]); // Intentionally omitting loadUsers to avoid double fetch

  const toggleSelect = (id: string) => {
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) setSelectedUsers([]);
    else setSelectedUsers(users.map(u => u.id));
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full h-full animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight">Gerenciamento de Usuários</h1>
            <p className="text-[#A8B3CF] mt-1 text-sm">Controle central de acessos, permissões e ciclos de vida.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors border border-white/10">
              <Upload className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Top Bar / Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#181C28]/60 backdrop-blur-md border border-white/5 rounded-2xl p-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B3CF]" />
            <input 
              type="text" 
              placeholder="Pesquisar por nome, email, ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {['Todos', 'Ativos', 'Bloqueados', 'Premium', 'Admins'].map(filter => (
              <button key={filter} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                filter === 'Todos' ? 'bg-white/10 text-white border-white/20' : 'bg-transparent text-[#A8B3CF] border-transparent hover:bg-white/5'
              }`}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 w-full border border-white/5 bg-[#181C28]/60 backdrop-blur-md rounded-2xl flex flex-col overflow-hidden">
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm text-[#A8B3CF]">
              <thead className="bg-white/5 border-b border-white/5 text-white/70 sticky top-0 z-10 backdrop-blur-xl">
                <tr>
                  <th className="px-6 py-4 w-12">
                    <input type="checkbox" className="rounded border-white/20 bg-white/5 checked:bg-blue-500" onChange={toggleSelectAll} checked={selectedUsers.length === users.length && users.length > 0} />
                  </th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:text-white" onClick={() => setSortBy('name')}>Usuário</th>
                  <th className="px-6 py-4 font-medium">Workspace</th>
                  <th className="px-6 py-4 font-medium">Plano & Role</th>
                  <th className="px-6 py-4 font-medium">Status & WhatsApp</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-transparent">
                {loading ? (
                  Array.from({length: 5}).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-6"><div className="w-4 h-4 bg-white/10 rounded"></div></td>
                      <td className="px-6 py-6"><div className="flex gap-3"><div className="w-10 h-10 bg-white/10 rounded-full"></div><div className="flex flex-col gap-2"><div className="w-32 h-3 bg-white/10 rounded"></div><div className="w-24 h-2 bg-white/5 rounded"></div></div></div></td>
                      <td colSpan={4}></td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-[#A8B3CF]">Nenhum usuário encontrado.</td></tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="rounded border-white/20 bg-white/5 checked:bg-blue-500" checked={selectedUsers.includes(user.id)} onChange={() => toggleSelect(user.id)} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedUserForDrawer(user.id)}>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-white font-medium uppercase">
                            {user.name?.charAt(0) || user.email?.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-medium group-hover:text-blue-400 transition-colors">{user.name}</span>
                            <span className="text-xs text-[#A8B3CF]">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-white/30" />
                          <span className="text-white/80">{user.workspace_name || 'Sem Workspace'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2 items-start">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider ${
                            user.plan_name?.toLowerCase().includes('premium') ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            user.plan_name?.toLowerCase().includes('business') ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                            user.plan_name?.toLowerCase().includes('trial') ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                            'bg-white/5 text-white/70 border-white/10'
                          }`}>
                            {user.plan_name || 'Free'}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest ${
                            user.role === 'super_admin' ? 'text-purple-400 bg-purple-400/10' :
                            user.role === 'admin' ? 'text-blue-400 bg-blue-400/10' :
                            'text-white/40 bg-white/5'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2 items-start">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : user.status === 'blocked' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                            <span className="text-xs capitalize">{user.status}</span>
                          </div>
                          {user.whatsapp_status && (
                            <div className="flex items-center gap-1.5 text-xs text-white/50">
                              <Smartphone className="w-3 h-3" />
                              <span className={user.whatsapp_status === 'active' ? 'text-green-400' : ''}>{user.whatsapp_status}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button 
                          onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)} 
                          className="p-2 text-[#A8B3CF] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenu === user.id && (
                          <>
                            <div className="fixed inset-0 z-20" onClick={() => setActiveMenu(null)} />
                            <div className="absolute right-10 top-12 w-56 bg-[#181C28] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-200">
                              <div className="p-1 flex flex-col">
                                <button onClick={() => { setSelectedUserForDrawer(user.id); setActiveMenu(null); }} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white hover:bg-white/5 rounded-lg transition-colors text-left">
                                  <Eye className="w-4 h-4 text-blue-400" /> Ver Perfil 360º
                                </button>
                                <button onClick={() => { setModalState({ type: 'plan', user }); setActiveMenu(null); }} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white hover:bg-white/5 rounded-lg transition-colors text-left">
                                  <CreditCard className="w-4 h-4 text-purple-400" /> Alterar Plano
                                </button>
                                <button onClick={() => { setModalState({ type: 'role', user }); setActiveMenu(null); }} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white hover:bg-white/5 rounded-lg transition-colors text-left">
                                  <Shield className="w-4 h-4 text-blue-400" /> Alterar Papel
                                </button>
                                <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white hover:bg-white/5 rounded-lg transition-colors text-left">
                                  <Key className="w-4 h-4 text-yellow-400" /> Resetar Senha
                                </button>
                                <div className="h-px bg-white/5 my-1 mx-2" />
                                <button onClick={() => { setModalState({ type: 'block', user }); setActiveMenu(null); }} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white hover:bg-white/5 rounded-lg transition-colors text-left">
                                  {user.status === 'blocked' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Ban className="w-4 h-4 text-orange-400" />}
                                  {user.status === 'blocked' ? 'Desbloquear Acesso' : 'Bloquear Acesso'}
                                </button>
                                <button onClick={() => { setModalState({ type: 'delete', user }); setActiveMenu(null); }} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left">
                                  <Trash2 className="w-4 h-4" /> Desativar Conta
                                </button>
                                <div className="h-px bg-white/5 my-1 mx-2" />
                                <button disabled className="flex justify-between items-center w-full px-3 py-2 text-sm text-white/30 cursor-not-allowed rounded-lg text-left">
                                  <div className="flex items-center gap-3"><LogIn className="w-4 h-4" /> Entrar como Usuário</div>
                                  <span className="text-[9px] uppercase border border-white/10 px-1.5 rounded">Em Breve</span>
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="border-t border-white/5 p-4 flex items-center justify-between bg-black/20">
            <span className="text-sm text-[#A8B3CF]">
              Mostrando {Math.min((page - 1) * limit + 1, total)} até {Math.min(page * limit, total)} de {total} registros
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 text-[#A8B3CF] hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={page * limit >= total}
                className="p-1.5 text-[#A8B3CF] hover:text-white hover:bg-white/10 rounded-lg disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Drawer */}
      {selectedUserForDrawer && (
        <UserDrawer 
          userId={selectedUserForDrawer} 
          onClose={() => setSelectedUserForDrawer(null)} 
          onUpdate={loadUsers}
        />
      )}

      {/* Modals */}
      {modalState.user && (
        <>
          <RoleModal 
            isOpen={modalState.type === 'role'} 
            onClose={() => setModalState({ type: null, user: null })} 
            userId={modalState.user.id} 
            userName={modalState.user.name} 
            currentRole={modalState.user.role}
            onSuccess={loadUsers}
          />
          <PlanModal 
            isOpen={modalState.type === 'plan'} 
            onClose={() => setModalState({ type: null, user: null })} 
            userId={modalState.user.id} 
            userName={modalState.user.name} 
            currentPlan={modalState.user.plan_name}
            onSuccess={loadUsers}
          />
          <BlockModal 
            isOpen={modalState.type === 'block'} 
            onClose={() => setModalState({ type: null, user: null })} 
            userId={modalState.user.id} 
            userName={modalState.user.name} 
            isBlocked={modalState.user.status === 'blocked'}
            onSuccess={loadUsers}
          />
          <SoftDeleteModal 
            isOpen={modalState.type === 'delete'} 
            onClose={() => setModalState({ type: null, user: null })} 
            userId={modalState.user.id} 
            userName={modalState.user.name} 
            onSuccess={loadUsers}
          />
        </>
      )}
    </AdminLayout>
  );
}
