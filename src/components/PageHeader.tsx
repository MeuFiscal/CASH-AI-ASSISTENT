import type { ReactNode, ElementType } from 'react';

interface PageHeaderProps {
  icon: ElementType;
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

export function PageHeader({ icon: Icon, title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full">
      <div className="flex items-center gap-4">
        <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 shrink-0">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-black text-white tracking-tight">{title}</h1>
          <p className="text-[#A8B3CF] text-[15px] mt-1 leading-relaxed max-w-[800px]">
            {subtitle}
          </p>
        </div>
      </div>
      
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </header>
  );
}
