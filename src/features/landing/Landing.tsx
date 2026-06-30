/**
 * Cash AI — Landing Page
 *
 * The entry experience. Starts by asking the user's name,
 * then Cash AI greets them personally and presents itself.
 * Clean, conversational, premium.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, ChevronRight, ArrowLeft } from 'lucide-react';

import { cn } from '@/lib';
import { ROUTES } from '@/constants';

import {
  HeroInteligente,
  PremiumBackground,
  WhatsAppShowcase,
  AgendaShowcase
} from './components';
import { OnboardingFlow } from '@/features/onboarding/components/OnboardingFlow';

// ─── Helpers ────────────────────────────────────────────────────────────────

export function Landing() {
  const navigate = useNavigate();
  const [isOnboarding, setIsOnboarding] = useState(false);


  return (
    <div className="flex h-dvh flex-col items-center bg-transparent relative overflow-y-auto overflow-x-hidden text-white font-sans">
      
      {/* ── Background Dark Premium ── */}
      <PremiumBackground />

      {/* ── Navbar Premium ── */}
      <nav className={cn(
        "absolute top-0 w-full z-50 flex items-center justify-between px-8 py-5 transition-all duration-1000 ease-in-out border-b border-white/5 bg-[#0B1221]/40 backdrop-blur-xl",
        isOnboarding ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      )}>
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-[#3B82F6]" />
          <span className="font-bold text-[15px] tracking-tight text-white">Cash AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#A8B3CF]">
          <Link to={ROUTES.RECURSOS} className="hover:text-white transition-colors">Recursos</Link>
          <Link to={ROUTES.INTEGRACOES} className="hover:text-white transition-colors">Integrações</Link>
          <Link to={ROUTES.PRECOS} className="hover:text-white transition-colors">Preços</Link>
          <Link to={ROUTES.EMPRESA} className="hover:text-white transition-colors">Empresa</Link>
          <button 
            onClick={() => setIsOnboarding(true)}
            className="hover:text-white transition-colors text-[#3B82F6]"
          >
            Começar Agora
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/auth/login')}
            className="text-[13px] font-medium text-[#A8B3CF] hover:text-white transition-colors"
          >
            Entrar
          </button>
        </div>
      </nav>

      {/* ── Main Layout Container ── */}
      <div className={cn(
        "relative w-full min-h-full z-10 flex flex-col items-center transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0",
        "pt-24 md:pt-32 pb-20 md:pb-24 px-4 sm:px-6 md:px-12"
      )}>

        {/* ── Main Hero Section ── */}
        <div className={cn(
          "w-full max-w-5xl flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] order-1",
          isOnboarding ? "opacity-0 absolute scale-95 pointer-events-none" : "opacity-100 scale-100 relative z-10 mb-20"
        )}>
          <HeroInteligente />
        </div>

        {/* ── WhatsApp Showcase Section ── */}
        <div className={cn(
          "w-full max-w-6xl flex justify-center transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] order-2 mb-24",
          isOnboarding ? "opacity-0 absolute translate-y-12 pointer-events-none" : "opacity-100 translate-y-0 relative z-10"
        )}>
          <WhatsAppShowcase />
        </div>

        {/* ── Agenda Showcase Section ── */}
        <div className={cn(
          "w-full max-w-6xl flex justify-center transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] order-3 mb-24",
          isOnboarding ? "opacity-0 absolute translate-y-12 pointer-events-none" : "opacity-100 translate-y-0 relative z-10"
        )}>
          <AgendaShowcase />
        </div>

        {/* ── Sales Pitch ── */}
        <div className={cn(
          "w-full max-w-4xl flex flex-col items-center justify-center transition-all duration-700 ease-in-out order-4 text-center",
          isOnboarding ? "opacity-0 absolute translate-y-12 pointer-events-none" : "opacity-100 translate-y-0 relative z-20"
        )}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1E293B]/60 border border-white/10 w-fit mb-6 shadow-inner mx-auto">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
            <span className="text-[12px] font-semibold text-[#A8B3CF]">Inteligência Artificial Pessoal</span>
          </div>
          
          <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#8B5CF6] opacity-[0.12] blur-[100px] pointer-events-none -z-10" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-6 drop-shadow-xl">
              Seu segundo cérebro.
            </h1>
          </div>
          
          <p className="text-[15px] sm:text-base md:text-lg text-[#A8B3CF] leading-relaxed max-w-[650px] mx-auto mb-8 font-medium px-2 sm:px-0">
            Enquanto você trabalha, o Cash AI organiza sua agenda, acompanha suas finanças, conecta seus aplicativos e prepara tudo para você.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 w-full">
            <button 
              onClick={() => setIsOnboarding(true)}
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-[15px] font-semibold text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] w-full sm:w-auto"
            >
              Começar Agora <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* ── Back Button ── */}
      <div className={cn(
        "absolute top-6 left-6 z-50 transition-all duration-1000 delay-300",
        isOnboarding ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8 pointer-events-none"
      )}>
        <button 
          onClick={() => window.location.reload()} 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#181C28]/80 backdrop-blur-md border border-white/5 text-[#A8B3CF] hover:text-white hover:bg-white/10 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* ── Onboarding Area ── */}
      <div
        className={cn(
          "fixed inset-0 top-[80px] bottom-0 w-full overflow-hidden z-20 transition-all duration-1000 delay-300",
          isOnboarding ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12 pointer-events-none"
        )}
      >
        <div className="w-full h-full flex flex-col">
          {isOnboarding && <OnboardingFlow />}
        </div>
      </div>
    </div>
  );
}
