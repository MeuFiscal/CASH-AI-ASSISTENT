import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, Check, Smartphone, Monitor, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants';
import { PremiumBackground } from '../components/PremiumBackground';

/* ── WhatsApp Brand Icon ── */
function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 259" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M67.663 221.823l4.185 2.093c17.44 10.463 36.971 15.346 56.503 15.346 61.385 0 111.609-50.224 111.609-111.609 0-29.297-11.859-57.897-32.785-78.824-20.927-20.927-48.83-32.785-78.824-32.785-61.385 0-111.61 50.224-111.61 111.61 0 20.927 6.278 41.156 16.741 58.594l2.79 4.186-11.16 41.156 41.55-10.167z" fill="#25D366"/>
      <path d="M219.033 37.668C194.938 13.573 162.533 0 128.351 0 57.898 0 .698 57.2.698 127.654c0 22.322 6.278 44.645 16.74 63.48L0 259l70.454-18.136c18.835 10.463 39.762 15.346 60.69 15.346 70.453 0 127.653-57.2 127.653-127.653 0-34.183-13.573-66.588-39.764-90.889zM128.35 233.467c-18.835 0-37.668-4.882-53.712-14.648l-4.185-2.093-40.458 10.463 10.463-39.762-2.79-4.186C17.44 150.674 11.86 139.513 11.86 127.654c0-64.178 52.318-116.497 116.497-116.497 31.394 0 60.688 12.556 82.312 34.18 21.623 21.624 34.18 50.918 34.18 82.312-.698 64.178-52.318 115.8-116.498 115.8v.018z" fill="#25D366"/>
      <path d="M187.032 156.252c-3.488-1.744-20.927-10.463-24.415-11.509-3.488-1.744-5.58-1.744-8.37 1.744-2.79 3.488-10.463 11.509-13.253 14.299-2.79 2.79-4.882 2.79-8.37 1.047-3.488-1.744-14.648-5.58-27.901-16.74-10.463-9.068-16.741-20.23-19.53-23.718-2.79-3.488 0-5.58 2.092-6.976l5.58-6.278c1.744-1.744 2.79-3.488 4.185-5.58 1.395-2.093 0-4.186-.698-5.58-1.395-1.744-8.37-20.23-11.16-27.204-2.79-6.976-5.58-6.278-8.37-6.278-2.79 0-4.882-.698-7.672-.698-2.79 0-6.976 1.047-10.463 4.534-3.488 3.488-13.254 12.556-13.254 31.394 0 18.835 13.254 36.274 15.346 39.064 1.744 2.79 26.506 41.854 65.57 57.2 9.067 4.185 16.044 6.278 21.623 8.37 9.068 3.487 17.44 2.79 23.717 1.743 6.977-1.047 20.928-8.37 23.718-16.74 2.79-8.371 2.79-15.347 1.744-16.74-1.047-1.744-3.488-2.79-6.977-4.534z" fill="#FDFDFD"/>
    </svg>
  );
}

export function DemoPage() {
  const [step, setStep] = useState(0);

  // Auto-play the animation sequence
  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 800),    // User types message
      setTimeout(() => setStep(2), 2200),    // Message sent
      setTimeout(() => setStep(3), 3400),    // Cash AI responds
      setTimeout(() => setStep(4), 4800),    // Arrow animates
      setTimeout(() => setStep(5), 5800),    // Dashboard receives
      setTimeout(() => setStep(6), 7000),    // Dashboard updates
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Restart animation loop
  useEffect(() => {
    if (step === 6) {
      const restart = setTimeout(() => setStep(0), 5000);
      const restartSequence = setTimeout(() => {
        setStep(1);
        // Re-trigger the sequence
        const timers = [
          setTimeout(() => setStep(2), 1400),
          setTimeout(() => setStep(3), 2600),
          setTimeout(() => setStep(4), 4000),
          setTimeout(() => setStep(5), 5000),
          setTimeout(() => setStep(6), 6200),
        ];
        return () => timers.forEach(clearTimeout);
      }, 6000);
      return () => { clearTimeout(restart); clearTimeout(restartSequence); };
    }
  }, [step]);

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

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, width: '100%', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,9,13,0.7)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 1200, margin: '0 auto', padding: '16px 24px', boxSizing: 'border-box' }}>
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

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px', boxSizing: 'border-box' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 60px auto' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 16px 0' }}>
            Veja como funciona
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#A8B3CF', fontWeight: 500, lineHeight: 1.6, margin: 0 }}>
            Mande um comando pelo WhatsApp e veja tudo aparecer no seu painel instantaneamente.
          </p>
        </div>

        {/* ── Animation: Phone → Arrow → Dashboard ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(16px, 4vw, 48px)', flexWrap: 'wrap', marginBottom: 64 }}>
          
          {/* ── Realistic iPhone Mockup ── */}
          <div style={{ width: 'clamp(260px, 30vw, 320px)', flexShrink: 0, position: 'relative' }}>
            
            {/* Phone Body (Outer Rim) */}
            <div style={{
              background: 'linear-gradient(145deg, #4b4b4d, #2b2b2d, #1a1a1c, #4b4b4d)', // Titanium metallic rim
              borderRadius: 48,
              padding: 4, // Rim thickness
              boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(37,211,102,0.1), inset 0 0 8px rgba(255,255,255,0.2), inset 0 2px 2px rgba(255,255,255,0.4)',
              position: 'relative',
            }}>
              {/* Hardware Buttons */}
              <div style={{ position: 'absolute', left: -2, top: 100, width: 3, height: 26, background: '#1a1a1c', borderRadius: '2px 0 0 2px', boxShadow: 'inset -1px 0 1px rgba(255,255,255,0.1)' }} />
              <div style={{ position: 'absolute', left: -2, top: 140, width: 3, height: 45, background: '#1a1a1c', borderRadius: '2px 0 0 2px', boxShadow: 'inset -1px 0 1px rgba(255,255,255,0.1)' }} />
              <div style={{ position: 'absolute', left: -2, top: 195, width: 3, height: 45, background: '#1a1a1c', borderRadius: '2px 0 0 2px', boxShadow: 'inset -1px 0 1px rgba(255,255,255,0.1)' }} />
              <div style={{ position: 'absolute', right: -2, top: 160, width: 3, height: 65, background: '#1a1a1c', borderRadius: '0 2px 2px 0', boxShadow: 'inset 1px 0 1px rgba(255,255,255,0.1)' }} />

              {/* Inner Bezel */}
              <div style={{
                background: '#000',
                borderRadius: 45,
                padding: 8, // Bezel width
                position: 'relative',
              }}>
                
                {/* Screen */}
                <div style={{
                  background: '#EFEAE2', // WhatsApp chat background color
                  borderRadius: 37,
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  
                  {/* Dynamic Island */}
                  <div style={{ 
                    position: 'absolute', 
                    top: 10, 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    width: 90, 
                    height: 28, 
                    background: '#000', 
                    borderRadius: 20, 
                    zIndex: 30, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'flex-end', 
                    padding: '0 8px' 
                  }}>
                    {/* Camera lens */}
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#111', boxShadow: 'inset 0 0 4px rgba(255,255,255,0.1)' }} />
                  </div>

                  {/* Status Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px 0', background: '#F0F2F5', color: '#000', fontSize: 13, fontWeight: 700, zIndex: 20, position: 'relative' }}>
                    <span>17:13</span>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 1, alignItems: 'flex-end', height: 10 }}>
                        <div style={{ width: 3, height: 4, background: '#000', borderRadius: 1 }} />
                        <div style={{ width: 3, height: 6, background: '#000', borderRadius: 1 }} />
                        <div style={{ width: 3, height: 8, background: '#000', borderRadius: 1 }} />
                        <div style={{ width: 3, height: 10, background: '#000', borderRadius: 1 }} />
                      </div>
                      <div style={{ width: 18, height: 11, border: '1px solid #000', borderRadius: 4, position: 'relative', marginLeft: 2 }}>
                        <div style={{ position: 'absolute', top: 1, left: 1, bottom: 1, width: '80%', background: '#000', borderRadius: 1 }} />
                        <div style={{ position: 'absolute', right: -3, top: 3, width: 2, height: 3, background: '#000', borderRadius: '0 1px 1px 0' }} />
                      </div>
                    </div>
                  </div>
                  
                  {/* WhatsApp header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 12px 10px', background: '#F0F2F5', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ color: '#007AFF', display: 'flex', alignItems: 'center' }}>
                        <ArrowLeft style={{ width: 22, height: 22 }} />
                      </div>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Brain style={{ width: 20, height: 20, color: '#3B82F6' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ color: '#111B21', fontWeight: 600, fontSize: 15 }}>Cash AI</span>
                          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check style={{ width: 10, height: 10, color: '#fff', strokeWidth: 4 }} />
                          </div>
                        </div>
                        <span style={{ color: '#5E6C75', fontSize: 12, fontWeight: 400 }}>online agora</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, color: '#007AFF' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </div>
                  </div>

                  {/* Chat area */}
                  <div style={{ background: '#EFEAE2', padding: '16px 12px', minHeight: 250, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 12 }}>
                    
                    {/* User message */}
                    <div style={{
                      alignSelf: 'flex-end',
                      background: '#D9FDD3',
                      color: '#111B21',
                      padding: '8px 12px',
                      borderRadius: '12px 12px 0px 12px',
                      fontSize: 14,
                      fontWeight: 400,
                      maxWidth: '85%',
                      boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
                      opacity: step >= 2 ? 1 : 0,
                      transform: step >= 2 ? 'translateY(0)' : 'translateY(10px)',
                      transition: 'all 0.5s ease-out',
                      position: 'relative'
                    }}>
                      Gastei 45 reais no almoço
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 12, marginTop: 4, float: 'right' }}>
                        <span style={{ fontSize: 11, color: '#667781' }}>10:48</span>
                        <div style={{ display: 'flex' }}>
                          <Check style={{ width: 14, height: 14, color: '#53BDEB', marginRight: -8 }} />
                          <Check style={{ width: 14, height: 14, color: '#53BDEB' }} />
                        </div>
                      </div>
                      {/* Little tail */}
                      <svg viewBox="0 0 8 13" width="8" height="13" style={{ position: 'absolute', right: -8, top: 0, fill: '#D9FDD3' }}><path d="M5.188 1H0v11.142c1.42-.445 2.766-1.572 4.093-3.155.856-1.026 1.705-2.28 2.548-3.763C7.545 3.655 8 2.296 8 1H5.188z"/></svg>
                    </div>

                    {/* Cash AI response */}
                    <div style={{
                      alignSelf: 'flex-start',
                      background: '#FFFFFF',
                      color: '#111B21',
                      padding: '8px 12px',
                      borderRadius: '0px 12px 12px 12px',
                      fontSize: 14,
                      fontWeight: 400,
                      maxWidth: '90%',
                      boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
                      opacity: step >= 3 ? 1 : 0,
                      transform: step >= 3 ? 'translateY(0)' : 'translateY(10px)',
                      transition: 'all 0.5s ease-out',
                      position: 'relative',
                      marginTop: 4
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#53BDEB', marginBottom: 4 }}>Cash AI <Check style={{ width: 12, height: 12, color: '#53BDEB', display: 'inline-block', verticalAlign: 'middle', marginLeft: 2 }} /></div>
                      Anotado! 📝 <b>R$ 45,00</b> no almoço registrado em <b>Alimentação</b>.
                      <div style={{ marginTop: 8 }}>Você já gastou <b>R$ 340,00</b> nessa categoria este mês. Quer ver o resumo? 📊</div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 12, marginTop: 4, float: 'right' }}>
                        <span style={{ fontSize: 11, color: '#667781' }}>10:48</span>
                      </div>
                      {/* Little tail */}
                      <svg viewBox="0 0 8 13" width="8" height="13" style={{ position: 'absolute', left: -8, top: 0, fill: '#FFFFFF' }}><path d="M2.812 1H8v11.142c-1.42-.445-2.766-1.572-4.093-3.155C3.051 7.961 2.202 6.707 1.359 5.224.455 3.655 0 2.296 0 1h2.812z"/></svg>
                    </div>

                    {/* Suggestion Pills */}
                    <div style={{
                      display: 'flex', gap: 8, opacity: step >= 3 ? 1 : 0, transform: step >= 3 ? 'translateY(0)' : 'translateY(10px)', transition: 'all 0.5s ease-out', transitionDelay: '0.2s', marginTop: 4
                    }}>
                      <div style={{ padding: '6px 14px', borderRadius: 16, background: 'rgba(0, 168, 132, 0.1)', color: '#00A884', fontSize: 13, fontWeight: 500, border: '1px solid rgba(0, 168, 132, 0.2)' }}>Alimentação</div>
                      <div style={{ padding: '6px 14px', borderRadius: 16, background: 'rgba(0, 168, 132, 0.1)', color: '#00A884', fontSize: 13, fontWeight: 500, border: '1px solid rgba(0, 168, 132, 0.2)' }}>Finanças</div>
                    </div>

                  </div>

                  {/* Input bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px 16px', background: '#F0F2F5' }}>
                    <div style={{ color: '#54656F' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </div>
                    <div style={{ flex: 1, background: '#FFFFFF', borderRadius: 24, padding: '8px 14px', display: 'flex', alignItems: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
                      <span style={{ fontSize: 15, color: step >= 1 && step < 2 ? '#111B21' : '#8696A0', flex: 1 }}>
                        {step >= 1 && step < 2 ? (
                          <>Gastei 45 reais no almoço<span style={{ animation: 'pulse 1s infinite' }}>|</span></>
                        ) : (
                          'Mensagem'
                        )}
                      </span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#54656F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                    <div style={{ color: '#54656F' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                    </div>
                    <div style={{ color: '#54656F' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone label */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 }}>
              <Smartphone style={{ width: 16, height: 16, color: '#25D366' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#A8B3CF' }}>Seu WhatsApp</span>
            </div>
          </div>

          {/* ── Animated Arrow ── */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            opacity: step >= 4 ? 1 : 0.2,
            transition: 'opacity 0.6s ease-out',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              animation: step >= 4 ? 'pulse 1.5s ease-in-out infinite' : 'none',
            }}>
              <div style={{ width: 40, height: 2, background: step >= 4 ? '#3B82F6' : '#333', borderRadius: 2, transition: 'background 0.5s' }} />
              <ArrowRight style={{ width: 24, height: 24, color: step >= 4 ? '#3B82F6' : '#333', filter: step >= 4 ? 'drop-shadow(0 0 8px rgba(59,130,246,0.6))' : 'none', transition: 'all 0.5s' }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: step >= 4 ? '#3B82F6' : '#555', letterSpacing: '0.05em', transition: 'color 0.5s' }}>
              SINCRONIZANDO
            </span>
          </div>

          {/* ── Realistic MacBook Mockup ── */}
          <div style={{ width: 'clamp(300px, 40vw, 480px)', flexShrink: 0, position: 'relative', perspective: '1000px' }}>
            
            {/* Screen Lid (Top part) */}
            <div style={{
              background: 'linear-gradient(to bottom, #111, #000)', // Screen Bezel
              borderRadius: '16px 16px 0 0',
              padding: '12px 12px 0 12px',
              position: 'relative',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.5), 0 30px 80px rgba(0,0,0,0.6), inset 0 2px 2px rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderBottom: 'none'
            }}>
              {/* Webcam & Sensor */}
              <div style={{ position: 'absolute', top: 5, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, alignItems: 'center' }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#0a0a0a' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#111', border: '1px solid #222', boxShadow: 'inset 0 0 2px rgba(255,255,255,0.2)' }} />
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#054' }} /> {/* green light indicator */}
              </div>

              {/* Display Area */}
              <div style={{
                background: '#131722',
                border: '1px solid rgba(255,255,255,0.06)',
                borderBottom: 'none',
                borderRadius: '4px 4px 0 0',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
              }}>
                {/* macOS top bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F56', border: '1px solid rgba(0,0,0,0.1)' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E', border: '1px solid rgba(0,0,0,0.1)' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27C93F', border: '1px solid rgba(0,0,0,0.1)' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.8 }}>
                    <Brain style={{ width: 12, height: 12, color: '#3B82F6' }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#A8B3CF' }}>Cash AI — Painel</span>
                  </div>
                  <div style={{ width: 42 }} /> {/* balance space */}
                </div>

                {/* Dashboard content */}
                <div style={{ padding: '24px 24px 32px' }}>
                  {/* Balance */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, color: '#A8B3CF', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Saldo do Mês</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
                      R$ {step >= 6 ? '8.438,12' : '8.483,12'}
                    </div>
                  </div>

                  {/* Recent transactions */}
                  <div style={{ fontSize: 11, color: '#A8B3CF', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Últimos Lançamentos</div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* New entry - animated in */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: step >= 5 ? 'rgba(59,130,246,0.08)' : 'transparent',
                      border: step >= 5 ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                      opacity: step >= 5 ? 1 : 0,
                      transform: step >= 5 ? 'translateX(0)' : 'translateX(20px)',
                      transition: 'all 0.6s ease-out',
                      boxShadow: step >= 5 ? '0 0 20px rgba(59,130,246,0.1)' : 'none',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🍽️</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Almoço</div>
                          <div style={{ fontSize: 11, color: '#A8B3CF', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                            <WhatsAppIcon size={12} /> via WhatsApp • agora
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#EF4444' }}>- R$ 45,00</span>
                    </div>

                    {/* Existing entries */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>💼</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Freelance</div>
                          <div style={{ fontSize: 12, color: '#A8B3CF', marginTop: 2 }}>ontem</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#10B981' }}>+ R$ 2.500,00</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⛽</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Combustível</div>
                          <div style={{ fontSize: 12, color: '#A8B3CF', marginTop: 2 }}>ontem</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#EF4444' }}>- R$ 180,00</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* MacBook Bottom Bezel */}
              <div style={{ height: 18, background: 'linear-gradient(to bottom, rgba(255,255,255,0.02), transparent)' }} />
            </div>

            {/* Aluminum Base (Hinge and Base) */}
            <div style={{
              background: 'linear-gradient(to bottom, #e2e4e9, #b9bcc5, #888d9a)', // Realistic silver aluminum
              height: 14,
              borderRadius: '0 0 16px 16px',
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 2px 3px rgba(255,255,255,0.8), inset 0 -1px 2px rgba(0,0,0,0.3)',
              zIndex: 2
            }}>
              {/* Trackpad Notch */}
              <div style={{ width: 80, height: 5, background: 'linear-gradient(to bottom, #777, #999)', borderRadius: '0 0 6px 6px', opacity: 0.8, boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }} />
            </div>

            {/* Dashboard label */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 }}>
              <Monitor style={{ width: 16, height: 16, color: '#3B82F6' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#A8B3CF' }}>Seu Painel Web</span>
            </div>
          </div>
        </div>

        {/* ── Explanatory Text ── */}
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 48px auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800, color: '#fff', margin: '0 0 16px 0', lineHeight: 1.2 }}>
            Descomplicando a sua vida financeira.
          </h2>
          <p style={{ fontSize: 'clamp(15px, 1.8vw, 18px)', color: '#A8B3CF', lineHeight: 1.7, fontWeight: 500, margin: '0 0 12px 0' }}>
            Simples assim. Você manda um comando pelo WhatsApp e tudo fica salvo automaticamente no seu painel completo na web. Sem planilhas, sem formulários, sem complicação.
          </p>
          <p style={{ fontSize: 'clamp(15px, 1.8vw, 18px)', color: '#A8B3CF', lineHeight: 1.7, fontWeight: 500, margin: 0 }}>
            Cada gasto, cada receita, cada compromisso — tudo organizado em um único lugar, acessível de qualquer dispositivo, a qualquer momento.
          </p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link
            to={ROUTES.PRECOS}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '16px 40px',
              borderRadius: 50,
              background: '#3B82F6',
              color: '#fff',
              fontWeight: 700,
              fontSize: 17,
              textDecoration: 'none',
              boxShadow: '0 0 30px rgba(59,130,246,0.4)',
              transition: 'all 0.2s',
            }}
          >
            Quero começar <ArrowRight style={{ width: 20, height: 20 }} />
          </Link>
        </div>
      </div>

      {/* Inline animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
