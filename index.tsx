import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Shim de compatibilidade para evitar erro "process is not defined" no browser
// Fix: Cast window to any to resolve TypeScript error regarding the non-standard 'process' property
if (typeof window !== 'undefined') {
  (window as any).process = (window as any).process || { env: {} };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Não foi possível encontrar o elemento root");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}