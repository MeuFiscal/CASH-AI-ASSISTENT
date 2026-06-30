import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="w-full h-full flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {children}
    </div>
  );
}
