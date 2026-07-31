import { BrainCircuit, Database, LockKeyhole, Sparkles } from 'lucide-react';

export function HeroInteligente() {
  const capabilities = [
    { icon: LockKeyhole, label: 'Dados isolados por usuário' },
    { icon: Database, label: 'Memória baseada em dados reais' },
    { icon: BrainCircuit, label: 'IA executada em infraestrutura privada' },
  ];

  return (
    <section className="w-full rounded-[2rem] border border-white/10 bg-[#111827]/70 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="mb-6 flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-200">
          <Sparkles className="h-4 w-4" /> Inteligência privada e contextual
        </div>
        <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
          Uma IA que trabalha com os seus dados, sem misturá-los com ninguém.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#A8B3CF] md:text-lg">
          Organize finanças, agenda, documentos e memórias em um espaço protegido. O assistente consulta informações reais e informa claramente quando não souber algo.
        </p>
        <div className="mt-10 grid w-full gap-3 md:grid-cols-3">
          {capabilities.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-left text-sm text-white">
              <Icon className="h-5 w-5 shrink-0 text-blue-400" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
