import { useEffect, useState, memo } from 'react';

const Particles = memo(() => {
  const [particles, setParticles] = useState<Array<{ id: number; top: number; left: number; duration: number; delay: number; size: number; opacity: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 40 + 20, // 20-60s
      delay: Math.random() * -60, // random start time
      size: Math.random() * 1 + 1, // 1-2px
      opacity: Math.random() * 0.15 + 0.05, // 0.05 - 0.20
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `float-particle ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-100px) translateX(50px); }
          100% { transform: translateY(-200px) translateX(-50px); }
        }
        @keyframes aurora-wave {
          0% { transform: translateX(-50%) rotate(-15deg); }
          50% { transform: translateX(0%) rotate(-5deg); }
          100% { transform: translateX(50%) rotate(-15deg); }
        }
        @keyframes glow-pulse-slow {
          0%, 100% { opacity: 0.08; transform: scale(1); }
          50% { opacity: 0.12; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
});

export const PremiumBackground = memo(() => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#0B1221]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#152342] via-[#0B1221] to-[#0B1221]"></div>
      {/* Noise Texture (3%) */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      
      {/* Grid */}
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Aurora */}
      <div className="absolute inset-0 overflow-hidden mix-blend-screen opacity-40">
        <div 
          className="absolute top-[20%] left-0 w-[200%] h-[60%] bg-gradient-to-r from-transparent via-[#3B82F6]/5 to-transparent blur-[80px]"
          style={{ animation: 'aurora-wave 50s linear infinite alternate' }}
        />
        <div 
          className="absolute top-[40%] left-[-50%] w-[200%] h-[40%] bg-gradient-to-r from-transparent via-[#8B5CF6]/5 to-transparent blur-[100px]"
          style={{ animation: 'aurora-wave 60s linear infinite alternate-reverse' }}
        />
      </div>

      {/* Glow Azul (atrás do dashboard) */}
      <div 
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[60vw] h-[50vh] bg-[#3B82F6] blur-[250px] rounded-full mix-blend-screen"
        style={{ animation: 'glow-pulse-slow 15s ease-in-out infinite' }}
      />
      
      {/* Glow Verde (Finanças - lado esquerdo do dashboard) */}
      <div 
        className="absolute top-[10%] left-[20%] w-[300px] h-[300px] bg-[#10B981] opacity-[0.05] blur-[200px] rounded-full mix-blend-screen"
      />

      <Particles />
    </div>
  );
});
