import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './theme/tokens.css';

// Auto-reload quando há um novo deploy e os chunks JS antigos deixam de existir
window.addEventListener('error', (event) => {
  if (event.message?.includes('Failed to fetch dynamically imported module') || event.message?.includes('Importing a module script failed')) {
    console.warn('Novo deploy detectado. Recarregando a página...');
    window.location.reload();
  }
});

window.addEventListener('unhandledrejection', (event) => {
  const msg = event.reason?.message || String(event.reason);
  if (msg.includes('Failed to fetch dynamically imported module') || msg.includes('Importing a module script failed')) {
    console.warn('Novo deploy detectado. Recarregando a página...');
    window.location.reload();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
