import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Building2, MessageSquare, 
  BrainCircuit, Wallet, Activity, Bell, Shield, Settings,
  LogOut, Eye, Server
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib';

const ADMIN_LINKS = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/users', icon: Users, label: 'Usuários' },
  { to: '/admin/workspaces', icon: Building2, label: 'Workspaces' },
  { to: '/admin/whatsapp', icon: MessageSquare, label: 'WhatsApp' },
  { to: '/admin/openai', icon: BrainCircuit, label: 'OpenAI' },
  { to: '/admin/health', icon: Server, label: 'Sistema' },
  { to: '/admin/subscriptions', icon: Wallet, label: 'Assinaturas' },
  { to: '/admin/analytics', icon: Activity, label: 'Analytics' },
  { to: '/admin/notifications', icon: Bell, label: 'Notificações' },
  { to: '/admin/audit', icon: Shield, label: 'Auditoria' },
  { to: '/admin/settings', icon: Settings, label: 'Configurações' },
];

export function AdminSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-64 h-full flex flex-col bg-[#0B1221]/80 border-r border-white/5 backdrop-blur-xl">
      
      {/* Header */}
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3 text-white">
          <Shield className="w-6 h-6 text-[#F59E0B]" />
          <div className="flex flex-col leading-tight">
            <span className="font-bold tracking-wide">Admin OS</span>
            <span className="text-[10px] text-[#A8B3CF] font-medium tracking-widest uppercase">Centro de Operações</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        <nav className="flex flex-col gap-1">
          {ADMIN_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium",
                  isActive 
                    ? "bg-[#F59E0B]/10 text-[#F59E0B] shadow-[inset_2px_0_0_#F59E0B]" 
                    : "text-[#A8B3CF] hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-colors duration-200"
                )} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Dual Environment Toggle */}
      <div className="p-4 border-t border-white/5 bg-[#0B1221]/50">
        
        {/* User Info */}
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#1E293B] border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <Users className="w-4 h-4 text-[#A8B3CF]" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-white truncate">{user?.name}</span>
            <span className="text-xs text-[#F59E0B] truncate">Super Admin</span>
          </div>
        </div>

        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 transition-colors"
        >
          <Eye className="w-4 h-4" />
          Centro de Inteligência
        </button>

        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
