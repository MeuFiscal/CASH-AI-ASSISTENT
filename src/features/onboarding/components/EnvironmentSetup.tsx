import { useState, useEffect } from 'react';
import { 
  User, Database, LayoutDashboard, Calendar, 
  Wallet, FolderOpen, BrainCircuit, MessageCircle, 
  CheckCircle2, Loader2, Check
} from 'lucide-react';
import { cn } from '@/lib';

const SETUP_STEPS = [
  { id: 'conta', label: 'Conta', icon: User, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'db', label: 'Banco de Dados', icon: Database, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  { id: 'dash', label: 'Dashboard', icon: LayoutDashboard, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { id: 'agenda', label: 'Agenda', icon: Calendar, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  { id: 'financas', label: 'Financeiro', icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: 'docs', label: 'Documentos', icon: FolderOpen, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { id: 'ai', label: 'Núcleo IA', icon: BrainCircuit, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  { id: 'wpp', label: 'WhatsApp', icon: MessageCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
  { id: 'done', label: 'Finalizando', icon: CheckCircle2, color: 'text-teal-400', bg: 'bg-teal-400/10' }
];

import { registerUser } from '@/services/auth/registerUser';

interface EnvironmentSetupProps {
  onComplete: () => void;
  userData: {
    name: string;
    email: string;
    phone: string;
    password?: string;
  };
}

export function EnvironmentSetup({ onComplete, userData }: EnvironmentSetupProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    const startSetup = async () => {
      try {
        // We start the UI animation first
        interval = setInterval(() => {
          setCurrentStepIndex(prev => {
            if (prev < SETUP_STEPS.length - 2) { // up to the second to last
              return prev + 1;
            }
            return prev;
          });
        }, 600);

        // Run actual registration in the background
        const res = await registerUser(userData);
        
        if (!res.success) {
          throw new Error(res.error || 'Failed to register');
        }

        // Registration complete, clear interval and finish UI
        clearInterval(interval);
        setCurrentStepIndex(SETUP_STEPS.length - 1); // final step (done)
        
        setTimeout(() => setIsFinished(true), 500);
        setTimeout(() => onComplete(), 1500);
      } catch (err: any) {
        clearInterval(interval);
        setError(err.message);
        console.error(err);
      }
    };

    startSetup();

    return () => clearInterval(interval);
  }, [onComplete, userData]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center">
        <h2 className="text-xl text-red-500 mb-2">Erro na criação do ambiente</h2>
        <p className="text-[#A8B3CF]">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-[#3B82F6] rounded-xl text-white">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col items-center justify-center w-full h-full overflow-y-auto pt-6 pb-8 px-4 sm:px-8 md:px-12 lg:px-20 animate-in fade-in duration-1000"
    >
      
      {/* ── Header — texto em linha normal ── */}
      <div className="w-full max-w-[90vw] text-center mb-6 sm:mb-10 mt-auto">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#3B82F6]/20 to-[#8B5CF6]/20 flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-[0_0_40px_rgba(59,130,246,0.15)] border border-white/5 relative">
          <div className="absolute inset-0 rounded-2xl bg-[#3B82F6] opacity-10 animate-ping" />
          <span className="text-3xl sm:text-4xl">🧠</span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 sm:mb-3 tracking-tight whitespace-nowrap">
          {isFinished ? 'Seu espaço está pronto' : 'Preparando seu ambiente'}
        </h2>
        <p className="text-[#A8B3CF] text-[14px] sm:text-[16px] font-medium leading-relaxed max-w-full mx-auto w-max md:whitespace-nowrap flex flex-col md:block">
          <span>{isFinished ? 'Toda a infraestrutura foi configurada com sucesso.' : 'Aguarde enquanto configuramos seus'}</span>
          <span>{isFinished ? ' Inicializando Cash AI...' : ' módulos exclusivos.'}</span>
        </p>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 w-full max-w-4xl mb-auto">
        {SETUP_STEPS.map((step, index) => {
          const isVisible = index <= currentStepIndex;
          const isProcessing = index === currentStepIndex && !isFinished;
          const isCompleted = index < currentStepIndex || isFinished;
          
          const Icon = step.icon;

          return (
            <div 
              key={step.id} 
              className={cn(
                "relative flex flex-col items-center justify-center rounded-[20px] border transition-all duration-700 ease-out",
                "py-4 sm:py-5 lg:py-6 px-3",
                isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4",
                isCompleted ? "bg-[#181C28]/80 border-white/10" : 
                isProcessing ? "bg-[#181C28]/60 border-[#3B82F6]/30 shadow-[0_0_20px_rgba(59,130,246,0.12)] ring-1 ring-[#3B82F6]/20" : 
                "bg-[#181C28]/30 border-white/5"
              )}
            >
              {/* Status Indicator */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                {isCompleted && <Check className="w-4 h-4 text-[#10B981] animate-in zoom-in" />}
                {isProcessing && <Loader2 className="w-4 h-4 text-[#3B82F6] animate-spin" />}
              </div>

              {/* Icon */}
              <div className={cn(
                "w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-[14px] flex items-center justify-center mb-3 sm:mb-4 transition-all duration-500",
                isVisible ? step.bg : "bg-white/5",
                isProcessing && "animate-pulse"
              )}>
                <Icon className={cn("w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8", isVisible ? step.color : "text-white/20")} />
              </div>

              {/* Label */}
              <span className={cn(
                "text-[12px] sm:text-[14px] lg:text-[15px] font-bold text-center leading-tight transition-colors duration-500 tracking-wide",
                isCompleted ? "text-white" : isProcessing ? "text-[#E2E8F0]" : "text-[#64748B]"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
