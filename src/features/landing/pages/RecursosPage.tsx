import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, MessageCircle, BarChart3, Calendar, Shield, Brain } from 'lucide-react';
import { ROUTES } from '@/constants';
import { PremiumBackground } from '../components/PremiumBackground';

const features = [
  { icon: Zap, title: "Categorização Imediata", desc: "A IA entende o contexto e classifica gastos automaticamente." },
  { icon: MessageCircle, title: "Gestão pelo WhatsApp", desc: "Mande áudios ou textos naturais e deixe a IA fazer o trabalho duro." },
  { icon: BarChart3, title: "Dashboards Inteligentes", desc: "Acompanhe para onde seu dinheiro vai com gráficos lindos." },
  { icon: Calendar, title: "Agenda Sincronizada", desc: "Integração total com o Google Agenda para lembretes de contas." },
  { icon: Shield, title: "Segurança de Dados", desc: "Criptografia de ponta a ponta garantindo que seus dados são seus." },
  { icon: Brain, title: "Insights Ativos", desc: "Receba alertas antes de estourar o orçamento e dicas de economia." },
];

export function RecursosPage() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: '#0B1221',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <PremiumBackground />

      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          width: '100%',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(8,9,13,0.7)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: 1200,
            margin: '0 auto',
            padding: '16px 24px',
            boxSizing: 'border-box',
          }}
        >
          <Link to={ROUTES.LANDING} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowLeft style={{ width: 20, height: 20, color: '#A8B3CF' }} />
            </div>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>Voltar</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Brain style={{ width: 22, height: 22, color: '#3B82F6' }} />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Cash AI</span>
          </div>
        </div>
      </header>

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '64px 24px 80px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 64px auto' }}>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 20px 0' }}>
            Tudo que você precisa em um só lugar.
          </h1>
          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#A8B3CF', fontWeight: 500, lineHeight: 1.6, margin: 0 }}>
            O assistente financeiro mais avançado do mercado trabalhando para você 24h por dia.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: 24,
            width: '100%',
          }}
        >
          {features.map((f, i) => (
            <div key={i} style={{ padding: 32, borderRadius: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <f.icon style={{ width: 28, height: 28, color: '#3B82F6' }} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 12px 0' }}>{f.title}</h3>
              <p style={{ fontSize: 15, color: '#A8B3CF', lineHeight: 1.7, fontWeight: 500, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
