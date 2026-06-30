import type { ReactNode } from 'react';
import { cn } from '@/lib';

interface PageSectionProps {
  title?: string;
  className?: string;
  children: ReactNode;
}

export function PageSection({ title, className, children }: PageSectionProps) {
  return (
    <section className={cn("flex flex-col w-full", className)}>
      {title && (
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-[14px] font-bold text-white tracking-widest uppercase">
            {title}
          </h2>
          <div className="flex-1 h-[1px] bg-white/5" />
        </div>
      )}
      <div className="w-full">
        {children}
      </div>
    </section>
  );
}
