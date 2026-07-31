/**
 * Cash AI — Landing Page
 *
 * The entry experience. Starts by asking the user's name,
 * then Cash AI greets them personally and presents itself.
 * Clean, conversational, premium.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Brain, ChevronRight, ArrowLeft, Zap, Database, BarChart3,
  Calendar, Shield, Cloud, Mail, Check, ArrowRight
} from 'lucide-react';

import { cn } from '@/lib';
import { ROUTES } from '@/constants';

import {
  HeroInteligente,
  PremiumBackground
} from './components';
import { OnboardingFlow } from '@/features/onboarding/components/OnboardingFlow';

// ─── Helpers ────────────────────────────────────────────────────────────────

const features = [
  { icon: Zap, title: 'Categorização imediata', desc: 'A IA entende o contexto e classifica gastos automaticamente.' },
  { icon: Database, title: 'Memória privada', desc: 'Contexto e histórico isolados por usuário, sempre consultados com segurança.' },
  { icon: BarChart3, title: 'Dashboards inteligentes', desc: 'Acompanhe suas finanças com informações claras e gráficos organizados.' },
  { icon: Calendar, title: 'Agenda organizada', desc: 'Compromissos, lembretes e contas reunidos em um só lugar.' },
  { icon: Shield, title: 'Segurança de dados', desc: 'Cada usuário acessa somente as informações do próprio espaço.' },
  { icon: Brain, title: 'Insights ativos', desc: 'Receba alertas e orientações baseados nos seus dados reais.' },
];

const integrations = [
  { icon: Calendar, name: 'Google Agenda', desc: 'Compromissos e lembretes sincronizados com sua rotina.', status: 'Planejado' },
  { icon: Cloud, name: 'Google Drive', desc: 'Documentos autorizados disponíveis para busca e resumo.', status: 'Planejado' },
  { icon: Mail, name: 'E-mail', desc: 'Contas e informações importantes organizadas com sua permissão.', status: 'Planejado' },
];

const benefits = [
  'Registro ilimitado de gastos',
  'Assistente privado no painel',
  'Agenda e documentos organizados',
  'Relatórios e gráficos detalhados',
  'Suporte prioritário',
  'Novos recursos inclusos',
];

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
        <div className="flex items-center gap-3 md:gap-8 text-[10px] md:text-[13px] font-medium text-[#A8B3CF]">
          <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
          <a href="#integracoes" className="hover:text-white transition-colors">Integrações</a>
          <a href="#preco" className="hover:text-white transition-colors">Preços</a>
          <Link to={ROUTES.EMPRESA} className="hover:text-white transition-colors">Empresa</Link>
          <button 
            onClick={() => setIsOnboarding(true)}
            className="hover:text-white transition-colors text-[#3B82F6] hidden md:block"
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
          "w-full max-w-5xl flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isOnboarding ? "opacity-0 absolute scale-95 pointer-events-none" : "opacity-100 scale-100 relative z-10 mb-20"
        )}>
          <HeroInteligente />
        </div>

        {/* ── Sales Pitch ── */}
        <div className={cn(
          "w-full max-w-4xl flex flex-col items-center justify-center transition-all duration-700 ease-in-out text-center",
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

        <div className={cn(
          'mt-24 flex w-full max-w-7xl flex-col gap-28 transition-all duration-700',
          isOnboarding ? 'pointer-events-none absolute opacity-0' : 'relative opacity-100'
        )}>
          <section id="recursos" className="scroll-mt-24">
            <div className="mx-auto mb-12 max-w-[720px] text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-blue-400">Recursos</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">Tudo que você precisa em um só lugar.</h2>
              <p className="mt-5 text-lg leading-relaxed text-[#A8B3CF]">Uma visão completa da sua vida financeira e da sua rotina, com inteligência e privacidade.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, desc }) => (
                <article key={title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl transition-colors hover:bg-white/[0.06]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-400/10">
                    <Icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#A8B3CF]">{desc}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="integracoes" className="scroll-mt-24">
            <div className="mx-auto mb-12 max-w-[720px] text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-blue-400">Integrações</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">Conecte apenas o que você quiser.</h2>
              <p className="mt-5 text-lg leading-relaxed text-[#A8B3CF]">Cada integração será opcional, terá permissões mínimas e poderá ser revogada pelo usuário.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {integrations.map(({ icon: Icon, name, desc, status }) => (
                <article key={name} className="rounded-3xl border border-white/10 bg-[#111827]/70 p-7 backdrop-blur-xl">
                  <Icon className="h-8 w-8 text-blue-400" />
                  <h3 className="mt-5 text-xl font-bold">{name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#A8B3CF]">{desc}</p>
                  <span className="mt-5 inline-block rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">{status}</span>
                </article>
              ))}
            </div>
          </section>

          <section id="preco" className="scroll-mt-24 pb-8">
            <div className="mx-auto mb-12 max-w-[720px] text-center">
              <span className="text-sm font-bold uppercase tracking-widest text-blue-400">Preço</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">Invista na sua tranquilidade.</h2>
              <p className="mt-5 text-lg leading-relaxed text-[#A8B3CF]">Um plano completo para organizar sua vida com Inteligência Artificial.</p>
            </div>
            <div className="relative mx-auto w-full max-w-[520px]">
              <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[80px] bg-gradient-to-b from-purple-500/25 to-blue-500/25 blur-[100px]" />
              <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#0F111A]/90 p-7 pt-12 shadow-2xl backdrop-blur-2xl sm:p-10 sm:pt-14">
                <div className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap rounded-b-2xl bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2 text-[11px] font-extrabold uppercase tracking-widest">Oferta de lançamento</div>
                <h3 className="text-center text-2xl font-bold">Cash AI Premium</h3>
                <div className="mt-8 text-center">
                  <span className="text-lg font-medium text-red-400 line-through">R$ 129,90</span>
                  <div className="mt-1"><span className="text-5xl font-black tracking-tighter sm:text-6xl">R$ 54,90</span><span className="ml-2 text-lg text-[#A8B3CF]">/mês</span></div>
                </div>
                <div className="my-10 flex flex-col gap-4">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10"><Check className="h-4 w-4 text-emerald-400" /></span>
                      <span className="font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setIsOnboarding(true)} className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-white text-lg font-bold text-black shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-transform hover:scale-[1.01]">
                  Começar agora <ArrowRight className="h-5 w-5" />
                </button>
                <p className="mt-5 text-center text-sm text-[#A8B3CF]">Cancele a qualquer momento. Sem fidelidade.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ── Footer / Rodapé ── */}
      <div className={cn(
        "w-full py-6 flex flex-col items-center justify-center gap-3 text-[10px] md:text-[11px] text-[#A8B3CF]/50 relative z-20",
        isOnboarding ? "opacity-0 pointer-events-none absolute" : "opacity-100"
      )}>
        <div className="flex gap-4">
          <Link to={ROUTES.TERMOS} className="hover:text-[#A8B3CF] transition-colors">Termos de Uso</Link>
          <Link to={ROUTES.PRIVACIDADE} className="hover:text-[#A8B3CF] transition-colors">Política de Privacidade</Link>
        </div>
        <span>© {new Date().getFullYear()} Cash AI. Todos os direitos reservados.</span>
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
