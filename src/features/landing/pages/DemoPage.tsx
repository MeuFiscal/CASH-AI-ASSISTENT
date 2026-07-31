import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, Database, Calendar, Wallet } from 'lucide-react';
import { ROUTES } from '@/constants';
import { PremiumBackground } from '../components/PremiumBackground';

export function DemoPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0B1221] px-6 py-16 text-white">
      <PremiumBackground />
      <div className="relative z-10 mx-auto max-w-5xl">
        <Link to={ROUTES.LANDING} className="mb-12 inline-flex items-center gap-2 text-[#A8B3CF] hover:text-white">
          <ArrowLeft className="h-5 w-5" /> Voltar
        </Link>
        <div className="text-center">
          <Brain className="mx-auto h-12 w-12 text-blue-400" />
          <h1 className="mt-6 text-4xl font-black md:text-6xl">Veja seus dados trabalhando a seu favor.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[#A8B3CF]">Converse no painel privado. A IA consulta apenas o espaço autenticado do usuário e usa ferramentas reais para organizar informações.</p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            { icon: Wallet, title: 'Finanças reais', text: 'Saldos e lançamentos confirmados antes de qualquer alteração.' },
            { icon: Calendar, title: 'Agenda organizada', text: 'Consultas e compromissos vinculados ao seu espaço.' },
            { icon: Database, title: 'Memória privada', text: 'Contexto persistente sem misturar dados entre usuários.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <Icon className="h-7 w-7 text-blue-400" />
              <h2 className="mt-5 text-xl font-bold">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#A8B3CF]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
