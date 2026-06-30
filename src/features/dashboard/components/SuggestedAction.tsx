import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib';

interface SuggestedActionProps {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function SuggestedAction({ label, icon, onClick, className }: SuggestedActionProps) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between w-full p-4 rounded-2xl transition-all duration-400 ease-out",
        "bg-[#181C28]/60 border border-white/5 backdrop-blur-md shadow-sm",
        "hover:bg-[#1E293B]/80 hover:border-[#3B82F6]/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] group-hover:scale-110 transition-transform duration-400">
          {icon}
        </div>
        <span className="text-[15px] font-medium text-white tracking-wide">{label}</span>
      </div>
      
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] group-hover:text-[#3B82F6] group-hover:bg-[#3B82F6]/10 group-hover:translate-x-1 transition-all duration-400">
        <ArrowRight className="w-4 h-4" />
      </div>
    </button>
  );
}
