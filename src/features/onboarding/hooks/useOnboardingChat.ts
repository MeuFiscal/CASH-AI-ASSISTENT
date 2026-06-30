import { useState, useCallback, useRef, useEffect } from 'react';
import type { ChatMessage } from '@/types';

export type OnboardingPhase = 
  | 'start' // Transitioning in
  | 'greeting'
  | 'ask-name'
  | 'wait-name'
  | 'ask-email'
  | 'wait-email'
  | 'ask-phone'
  | 'wait-phone'
  | 'ask-password'
  | 'wait-password'
  | 'ask-confirm-password'
  | 'wait-confirm-password'
  | 'ask-objective'
  | 'wait-objective'
  | 'ask-platform'
  | 'wait-platform'
  | 'ask-notifications'
  | 'wait-notifications'
  | 'ask-summary'
  | 'wait-summary'
  | 'setup' // Show EnvironmentSetup
  | 'done'; // Redirect to Dashboard

interface OnboardingData {
  name: string;
  email: string;
  phone: string;
  password?: string;
  objective: string;
  platform: string;
  notifications: boolean;
  dailySummary: boolean;
}

export function useOnboardingChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [phase, setPhase] = useState<OnboardingPhase>('start');
  const [userData, setUserData] = useState<Partial<OnboardingData>>({});
  
  const passwordRef = useRef('');
  const hasStarted = useRef(false);

  const addAiMessage = useCallback((content: string, delay: number = 800) => {
    return new Promise<void>((resolve) => {
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}-${Math.random()}`,
            content,
            role: 'assistant',
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
        resolve();
      }, delay);
    });
  }, []);

  const addUserMessage = useCallback((content: string, maskedContent?: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}-${Math.random()}`,
        content: maskedContent || content, // Use masked content for passwords
        role: 'user',
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Initialize greeting
  useEffect(() => {
    if (phase === 'start' && !hasStarted.current) {
      hasStarted.current = true;
      const runGreeting = async () => {
        setPhase('greeting');
        await addAiMessage('👋 Olá.', 800);
        await addAiMessage('Eu sou o Cash AI.', 1000);
        await addAiMessage('Antes de começarmos, vou preparar um espaço totalmente seu.', 1200);
        await addAiMessage('Ele será privado, seguro e criado especialmente para você.', 1200);
        await addAiMessage('Em poucos minutos seu segundo cérebro estará pronto para trabalhar.', 1200);
        await addAiMessage('Vamos começar.', 800);
        
        setPhase('ask-name');
        await addAiMessage('Como você gostaria de ser chamado?', 600);
        setPhase('wait-name');
      };
      runGreeting();
    }
  }, [phase, addAiMessage]);

  const handleInput = async (input: string) => {
    if (phase === 'wait-name') {
      addUserMessage(input);
      setUserData(prev => ({ ...prev, name: input }));
      setPhase('ask-email');
      await addAiMessage('Qual será seu e-mail de acesso?', 800);
      setPhase('wait-email');
    } 
    else if (phase === 'wait-email') {
      addUserMessage(input);
      setUserData(prev => ({ ...prev, email: input }));
      setPhase('ask-phone');
      await addAiMessage('Qual número de WhatsApp você utilizará?', 800);
      setPhase('wait-phone');
    }
    else if (phase === 'wait-phone') {
      addUserMessage(input);
      setUserData(prev => ({ ...prev, phone: input }));
      setPhase('ask-password');
      await addAiMessage('Agora escolha uma senha segura.', 800);
      setPhase('wait-password');
    }
    else if (phase === 'wait-password') {
      addUserMessage(input, '••••••••');
      passwordRef.current = input;
      setPhase('ask-confirm-password');
      await addAiMessage('Por favor, confirme sua senha.', 600);
      setPhase('wait-confirm-password');
    }
    else if (phase === 'wait-confirm-password') {
      addUserMessage(input, '••••••••');
      if (input !== passwordRef.current) {
        await addAiMessage('As senhas não coincidem. Tente novamente, por favor.', 600);
        // Stay in wait-confirm-password
        return;
      }
      setPhase('ask-objective');
      await addAiMessage('O que você deseja organizar primeiro?', 800);
      setPhase('wait-objective');
    }
  };

  const handleSuggestionSelect = async (value: string, label: string) => {
    addUserMessage(label);
    
    if (phase === 'wait-objective') {
      setUserData(prev => ({ ...prev, objective: value }));
      setPhase('ask-platform');
      await addAiMessage('Você utiliza principalmente:', 800);
      setPhase('wait-platform');
    }
    else if (phase === 'wait-platform') {
      setUserData(prev => ({ ...prev, platform: value }));
      setPhase('ask-notifications');
      await addAiMessage('Deseja receber lembretes pelo WhatsApp?', 800);
      setPhase('wait-notifications');
    }
    else if (phase === 'wait-notifications') {
      setUserData(prev => ({ ...prev, notifications: value === 'yes' }));
      setPhase('ask-summary');
      await addAiMessage('Deseja receber um resumo diário das suas atividades?', 800);
      setPhase('wait-summary');
    }
    else if (phase === 'wait-summary') {
      setUserData(prev => ({ ...prev, dailySummary: value === 'yes' }));
      setPhase('setup');
    }
  };

  return {
    messages,
    isTyping,
    phase,
    userData,
    handleInput,
    handleSuggestionSelect,
    setPhase
  };
}
