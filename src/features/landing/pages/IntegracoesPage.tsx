import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, Calendar, Cloud, Mail } from 'lucide-react';
import { ROUTES } from '@/constants';
import { PremiumBackground } from '../components/PremiumBackground';

export function IntegracoesPage() {
  const integrations = [
    { icon: Calendar, name: 'Google Agenda', status: 'Planejado' },
    { icon: Cloud, name: 'Google Drive', status: 'Planejado' },
    { icon: Mail, name: 'E-mail', status: 'Planejado' },
  ];
  return (
    <main className="relative min-h-screen bg-[#0B1221] px-6 py-16 text-white">
      <PremiumBackground />
      <div className="relative z-10 mx-auto max-w-5xl">
        <Link to={ROUTES.LANDING} className="inline-flex items-center gap-2 text-[#A8B3CF] hover:text-white"><ArrowLeft className="h-5 w-5" /> Voltar</Link>
        <Brain className="mx-auto mt-10 h-11 w-11 text-blue-400" />
        <h1 className="mt-5 text-center text-4xl font-black md:text-6xl">Integrações sob seu controle.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-center text-[#A8B3CF]">Cada integração será opcional, terá permissões mínimas e poderá ser revogada pelo usuário.</p>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {integrations.map(({ icon: Icon, name, status }) => (
            <div key={name} className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <Icon className="h-7 w-7 text-blue-400" />
              <h2 className="mt-5 text-xl font-bold">{name}</h2>
              <span className="mt-4 inline-block rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-300">{status}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
