import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Loader2, Brain } from 'lucide-react';

import { PremiumBackground } from '@/features/landing/components/PremiumBackground';

const MESSAGES = [
  "Carregando memória...",
  "Preparando painel...",
  "Organizando prioridades...",
  "Sincronizando ambiente...",
  "Centro de Inteligência pronto."
];

export function TransitionScreen() {
  const navigate = useNavigate();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Inicia a transição de mensagens (a cada 400ms avança uma)
    const interval = setInterval(() => {
      setMessageIndex(prev => {
        if (prev < MESSAGES.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 400);

    // Após 2.5s (um pouco mais que 1 segundo, para dar tempo de ler as 5 mensagens)
    const timeout = setTimeout(() => {
      navigate('/dashboard'); // Redireciona
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <main className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-[#0A0D14]">
      {/* Background idêntico à Landing */}
      <PremiumBackground />

      <div className="relative z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        <div className="flex items-center gap-3 mb-12 scale-125">
          <Brain className="w-8 h-8 text-[#3B82F6]" />
          <span className="font-bold text-[20px] tracking-tight text-white">Cash AI</span>
        </div>
        
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
          
          <div className="h-8 flex items-center justify-center overflow-hidden">
            {/* O "key" força a re-renderização do fade in cada vez que o index muda */}
            <div key={messageIndex} className="flex items-center gap-2 text-[#A8B3CF] animate-in fade-in slide-in-from-bottom-2 duration-300">
              {messageIndex === MESSAGES.length - 1 ? (
                <Check className="w-5 h-5 text-[#10B981]" />
              ) : (
                <Check className="w-4 h-4 text-[#3B82F6]" />
              )}
              <span className={`text-[15px] font-medium tracking-wide ${messageIndex === MESSAGES.length - 1 ? 'text-white' : ''}`}>
                {MESSAGES[messageIndex]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
