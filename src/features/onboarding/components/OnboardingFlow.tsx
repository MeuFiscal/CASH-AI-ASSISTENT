import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ChatBubble, TypingIndicator, ChatSuggestion } from './ChatComponents';
import { useOnboardingChat } from '../hooks/useOnboardingChat';
import { EnvironmentSetup } from './EnvironmentSetup';

// Simple masked input for WhatsApp: (XX) XXXXX-XXXX
function formatWhatsApp(value: string) {
  const v = value.replace(/\D/g, '');
  if (v.length <= 2) return v.replace(/(\d{2})/, '($1');
  if (v.length <= 7) return v.replace(/(\d{2})(\d+)/, '($1) $2');
  return v.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3').substring(0, 15);
}

export function OnboardingFlow() {
  const navigate = useNavigate();
  const { messages, isTyping, phase, userData, handleInput, handleSuggestionSelect } = useOnboardingChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    handleInput(inputValue.trim());
    setInputValue('');
  };

  const handleCompleteSetup = () => {
    // Navigate to Dashboard
    navigate('/dashboard?onboarded=true');
  };

  // ─── Rendering Suggestions based on phase ───
  let suggestions: { label: string, value: string }[] = [];
  if (phase === 'wait-objective') {
    suggestions = [
      { label: '📅 Minha Agenda', value: 'agenda' },
      { label: '💰 Minhas Finanças', value: 'financas' },
      { label: '📄 Documentos', value: 'documentos' },
      { label: '🚀 Tudo', value: 'tudo' }
    ];
  } else if (phase === 'wait-platform') {
    suggestions = [
      { label: 'Google', value: 'google' },
      { label: 'Apple', value: 'apple' },
      { label: 'Microsoft', value: 'microsoft' },
      { label: 'Outro', value: 'outro' }
    ];
  } else if (phase === 'wait-notifications' || phase === 'wait-summary') {
    suggestions = [
      { label: 'Sim', value: 'yes' },
      { label: 'Não', value: 'no' }
    ];
  }

  const isTextInputPhase = phase.includes('wait-') && suggestions.length === 0;

  if (phase === 'setup' || phase === 'done') {
    return <EnvironmentSetup onComplete={handleCompleteSetup} userData={userData as any} />;
  }

  return (
    <div className="flex flex-col w-full h-full animate-in fade-in duration-1000">
      <div 
        ref={scrollRef}
        className="flex-1 w-full overflow-y-auto"
      >
        <div className="w-full max-w-[48rem] mx-auto flex flex-col px-4 sm:px-6 py-6 sm:py-10 space-y-5">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg.content} role={msg.role} animate />
        ))}
        {isTyping && <TypingIndicator />}
        
        {suggestions.length > 0 && !isTyping && (
          <div className="flex flex-wrap gap-2 mt-4 animate-in fade-in-up">
            {suggestions.map((s) => (
              <ChatSuggestion 
                key={s.value} 
                text={s.label} 
                onClick={() => handleSuggestionSelect(s.value, s.label)} 
              />
            ))}
          </div>
        )}
      </div>
      </div>

      {isTextInputPhase && !isTyping && (
        <div className="w-full bg-[#0B1221]/60 backdrop-blur-xl border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="w-full max-w-[40rem] mx-auto px-4 sm:px-6 pb-6 pt-4 animate-in slide-in-from-bottom-4">
            <form 
              onSubmit={onSubmit}
              className="flex items-center gap-2 bg-[#181C28]/80 backdrop-blur-xl border border-white/10 rounded-full p-1.5 pl-5 shadow-lg focus-within:border-[#3B82F6]/50 focus-within:ring-2 focus-within:ring-[#3B82F6]/20 transition-all w-full"
            >
            <input
              type={phase.includes('password') ? 'password' : phase === 'wait-email' ? 'email' : 'text'}
              value={inputValue}
              onChange={(e) => {
                if (phase === 'wait-phone') {
                  setInputValue(formatWhatsApp(e.target.value));
                } else {
                  setInputValue(e.target.value);
                }
              }}
              placeholder={
                phase === 'wait-phone' ? '(00) 00000-0000' : 
                phase.includes('password') ? '••••••••' : 
                'Digite aqui...'
              }
              className="flex-1 bg-transparent border-none text-[15px] text-white placeholder-[#7B879D] focus:outline-none focus:ring-0"
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2563EB] transition-colors shrink-0"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
        </div>
      )}
    </div>
  );
}
