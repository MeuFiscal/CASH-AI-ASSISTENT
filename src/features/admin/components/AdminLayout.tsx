import type { ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { PremiumBackground } from '@/features/landing/components/PremiumBackground';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-[#0A0D14] overflow-hidden text-white font-sans selection:bg-[#F59E0B]/30 selection:text-white">
      
      {/* Background Aurora / Glassmorphism compartilhado */}
      <PremiumBackground />

      <div className="relative z-10 flex w-full h-full">
        <AdminSidebar />
        
        <main className="flex-1 h-full overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
