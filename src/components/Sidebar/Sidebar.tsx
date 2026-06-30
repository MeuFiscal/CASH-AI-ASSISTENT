
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Brain, 
  LayoutDashboard, 
  MessageSquareText, 
  Calendar, 
  Wallet, 
  FileText, 
  BrainCircuit, 
  Zap, 
  BarChart2, 
  Bell, 
  User, 
  Crown, 
  Settings, 
  LogOut,
  Search,
  Menu
} from 'lucide-react';
import { cn } from '@/lib';
import { useAuth } from '@/contexts/AuthContext';

type NavLinkItem = {
  icon: any;
  label: string;
  to: string;
  badge?: string;
  badgeColor?: 'blue' | 'green' | 'amber';
};

const MAIN_LINKS_BASE: Omit<NavLinkItem, 'badge' | 'badgeColor'>[] = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: MessageSquareText, label: 'Conversar', to: '/chat' },
  { icon: Calendar, label: 'Agenda', to: '/agenda' },
  { icon: Wallet, label: 'Finanças', to: '/finances' },
  { icon: FileText, label: 'Documentos', to: '/documents' },
  { icon: BrainCircuit, label: 'Memória', to: '/memory' },
  { icon: BarChart2, label: 'Insights', to: '/insights' },
  { icon: Brain, label: 'Minha IA', to: '/my-ai' },
  { icon: Zap, label: 'Superpoderes', to: '/superpowers' },
];

const BOTTOM_LINKS_BASE: Omit<NavLinkItem, 'badge' | 'badgeColor'>[] = [
  { icon: User, label: 'Perfil', to: '/profile' },
  { icon: Crown, label: 'Premium', to: '/premium' },
  { icon: Settings, label: 'Configurações', to: '/settings' },
  { icon: Bell, label: 'Notificações', to: '/notifications' },
];

interface SidebarProps {
  expanded: boolean;
  setExpanded: (val: boolean) => void;
}

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function Sidebar({ expanded, setExpanded }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [agendaCount, setAgendaCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  
  useEffect(() => {
    async function fetchCounts() {
      if (!user?.id) return;
      const { data: ws } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (ws?.workspace_id) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const { count: calCount } = await supabase
          .from('calendar_events')
          .select('id', { count: 'exact', head: true })
          .eq('workspace_id', ws.workspace_id)
          .gte('start_time', todayStart.toISOString());
          
        setAgendaCount(calCount || 0);

        const { count: notifCount } = await supabase
          .from('notifications')
          .select('id', { count: 'exact', head: true })
          .eq('workspace_id', ws.workspace_id)
          .is('read_at', null);
          
        setNotificationCount(notifCount || 0);
      }
    }
    fetchCounts();
  }, [user]);

  const MAIN_LINKS: NavLinkItem[] = MAIN_LINKS_BASE.map(item => {
    if (item.label === 'Agenda' && agendaCount > 0) return { ...item, badge: String(agendaCount), badgeColor: 'blue' };
    return item;
  });

  const BOTTOM_LINKS: NavLinkItem[] = BOTTOM_LINKS_BASE.map(item => {
    if (item.label === 'Notificações' && notificationCount > 0) return { ...item, badge: String(notificationCount), badgeColor: 'blue' };
    return item;
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        onClick={() => setExpanded(false)}
        className={cn(
          "fixed inset-0 z-40 bg-[#0a0a0a]/60 backdrop-blur-sm transition-opacity duration-300",
          expanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Sidebar Drawer */}
      <aside 
        className={cn(
          "h-screen fixed left-0 top-0 z-50 w-72 flex flex-col bg-[#0B1221]/95 backdrop-blur-3xl border-r border-white/5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          expanded ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header / Logo */}
        <div className="h-24 flex items-center px-6 shrink-0 justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-[#3B82F6] shrink-0" />
            <span className="font-bold text-[18px] text-white tracking-tight whitespace-nowrap">Cash AI</span>
          </div>
          <button 
            onClick={() => setExpanded(false)}
            className="p-2 -mr-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-[#A8B3CF] shrink-0" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 mb-6">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group">
            <Search className="w-5 h-5 text-[#A8B3CF] group-hover:text-white shrink-0" />
            <span className="text-[14px] font-medium text-[#A8B3CF] group-hover:text-white whitespace-nowrap">
              Pesquisar...
            </span>
          </button>
        </div>

        {/* Main Links */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide px-5 flex flex-col gap-1.5">
          {MAIN_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setExpanded(false)} // Auto close on navigation
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-[#3B82F6]/10 text-white" 
                    : "text-[#A8B3CF] hover:bg-white/5 hover:text-white"
                )}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn(
                      "w-5 h-5 shrink-0 transition-colors relative",
                      isActive ? "text-[#3B82F6]" : "group-hover:text-white"
                    )} />
                    
                    <span className="text-[15px] font-medium whitespace-nowrap flex-1">
                      {link.label}
                    </span>
                    
                    {link.badge && (
                      <span className={cn(
                        "text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap",
                        link.badgeColor === 'green' ? "bg-[#10B981]/10 text-[#10B981]" : 
                        link.badgeColor === 'amber' ? "bg-[#F59E0B]/10 text-[#F59E0B]" : 
                        "bg-[#3B82F6]/10 text-[#3B82F6]"
                      )}>
                        {link.badge}
                      </span>
                    )}

                    {isActive && (
                      <div className="absolute left-0 w-1 h-6 bg-[#3B82F6] rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Divider */}
        <div className="px-5 my-4">
          <div className="h-[1px] w-full bg-white/5" />
        </div>

        {/* Bottom Links */}
        <div className="px-5 pb-6 flex flex-col gap-1.5 shrink-0">
          {BOTTOM_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setExpanded(false)} // Auto close on navigation
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-[#A8B3CF] hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5 shrink-0 transition-colors" />
                <span className="text-[15px] font-medium whitespace-nowrap flex-1">
                  {link.label}
                </span>

                {link.badge && (
                  <span className={cn(
                    "text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap",
                    link.badgeColor === 'green' ? "bg-[#10B981]/10 text-[#10B981]" : 
                    link.badgeColor === 'amber' ? "bg-[#F59E0B]/10 text-[#F59E0B]" : 
                    "bg-[#3B82F6]/10 text-[#3B82F6]"
                  )}>
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#ef4444] hover:bg-[#ef4444]/10 transition-all duration-200 group relative mt-2"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="text-[15px] font-medium whitespace-nowrap">
              Sair
            </span>
          </button>
        </div>

      </aside>
    </>
  );
}
