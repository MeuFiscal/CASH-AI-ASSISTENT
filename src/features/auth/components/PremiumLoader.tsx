import { useEffect, useState } from 'react';
import { Brain } from 'lucide-react';

const loadingMessages = [
  "Conectando ao seu Centro de Inteligência...",
  "Sincronizando sua memória...",
  "Preparando sua Dashboard...",
  "Quase tudo pronto..."
];

export function PremiumLoader() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000); // changes message every 2 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B1221]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#3B82F6]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="flex flex-col items-center gap-6 relative z-10">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-[#3B82F6]/20 rounded-full animate-ping [animation-duration:3s]" />
          <div className="w-16 h-16 rounded-full bg-[#181C28] border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <Brain className="w-8 h-8 text-[#3B82F6] animate-pulse" />
          </div>
        </div>

        <div className="h-8 flex items-center justify-center overflow-hidden">
          <span 
            key={messageIndex}
            className="text-[15px] font-medium text-[#E2E8F0] tracking-wide animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            {loadingMessages[messageIndex]}
          </span>
        </div>
      </div>
    </div>
  );
}
