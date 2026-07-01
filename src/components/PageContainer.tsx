import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="w-full h-full flex flex-col gap-10 pb-20">
      {children}
    </div>
  );
}
