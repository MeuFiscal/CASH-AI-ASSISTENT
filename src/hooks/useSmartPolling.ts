import { useEffect, useState } from 'react';

/**
 * useSmartPolling
 * Polling inteligente que só é acionado quando a aba do navegador está visível.
 * Isso economiza uso intenso de requisições de banco de dados e Supabase Edge Functions.
 * 
 * @param callback Função a ser executada em background
 * @param intervalMs Tempo de intervalo em milissegundos (default 15s)
 * @param enabled Flag para habilitar ou pausar manualmente o polling
 */
export function useSmartPolling(callback: () => void | Promise<void>, intervalMs: number = 15000, enabled: boolean = true) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = document.visibilityState === 'visible';
      setIsVisible(visible);
      
      // Quando o usuário volta para a aba, força o callback imediatamente
      if (visible && enabled) {
        callback();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [callback, enabled]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isVisible && enabled) {
      intervalId = setInterval(() => {
        callback();
      }, intervalMs);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isVisible, enabled, callback, intervalMs]);
}
