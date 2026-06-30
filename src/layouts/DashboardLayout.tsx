import { useState, type ReactNode } from 'react';
import { PremiumBackground } from '@/features/landing/components/PremiumBackground';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { Menu, MessageSquareText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0a0a0a]">
      {/* Premium Background from Landing Page */}
      <PremiumBackground />
      
      {/* Floating Sidebar */}
      <Sidebar expanded={sidebarOpen} setExpanded={setSidebarOpen} />
      
      {/* Dashboard Content Container */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-stretch justify-start">
        
        {/* Top Navigation / Hamburger */}
        <header className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pt-8 pb-10 sm:pb-14 flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-xl shadow-lg"
          >
            <Menu className="w-6 h-6 text-[#A8B3CF]" />
          </button>

          <Link
            to="/chat"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 hover:bg-[#3B82F6]/20 transition-all duration-300 backdrop-blur-xl shadow-[0_0_15px_rgba(59,130,246,0.15)] group"
          >
            <MessageSquareText className="w-5 h-5 text-[#3B82F6] group-hover:scale-110 transition-transform" />
            <span className="text-[14px] font-bold text-[#3B82F6] whitespace-nowrap hidden sm:inline">Conversar com a IA</span>
            <span className="text-[14px] font-bold text-[#3B82F6] whitespace-nowrap sm:hidden">Chat</span>
          </Link>
        </header>

        {/* Full screen layout but constrained on ultra-wide screens */}
        <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 pb-8 sm:pb-12">
          {children}
        </main>
      </div>
    </div>
  );
}
