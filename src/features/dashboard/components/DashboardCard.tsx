import type { ReactNode } from 'react';
import { cn } from '@/lib';
import { Loader2, AlertCircle } from 'lucide-react';

export type CardState = 'loading' | 'empty' | 'error' | 'success';

interface DashboardCardProps {
  children?: ReactNode;
  className?: string;
  state?: CardState;
  emptyMessage?: string;
  errorMessage?: string;
}

export function DashboardCard({ 
  children, 
  className,
  state = 'success',
  emptyMessage = 'Nenhuma informação disponível.',
  errorMessage = 'Ocorreu um erro ao processar os dados.'
}: DashboardCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-[32px] transition-all duration-500",
      "bg-[#181C28]/60 border border-white/[0.03] backdrop-blur-3xl",
      "shadow-2xl shadow-black/20",
      "hover:bg-[#181C28]/80 hover:border-white/[0.05]",
      "group flex flex-col h-full",
      className
    )}>
      {/* Glow interno extremamente discreto */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <div className="relative z-10 w-full h-full p-6 sm:p-8">
        {state === 'loading' && (
          <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center gap-3 animate-in fade-in duration-500">
            <Loader2 className="w-6 h-6 text-[#3B82F6] animate-spin opacity-80" />
            <span className="text-[13px] font-medium text-[#A8B3CF]">Sincronizando inteligência...</span>
          </div>
        )}
        
        {state === 'error' && (
          <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center gap-3 animate-in fade-in duration-500">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-[14px] font-medium text-[#A8B3CF] text-center max-w-[200px]">{errorMessage}</span>
          </div>
        )}
        
        {state === 'empty' && (
          <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center gap-3 animate-in fade-in duration-500">
            <span className="text-[14px] font-medium text-[#7B879D] text-center max-w-[200px]">{emptyMessage}</span>
          </div>
        )}
        
        {state === 'success' && (
          <div className="w-full h-full animate-in fade-in duration-1000 overflow-y-auto scrollbar-hide flex-1">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
