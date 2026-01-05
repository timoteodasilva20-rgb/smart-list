
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Shim de compatibilidade para ambientes Vite/Vercel
// Isso evita o erro "process is not defined" sem quebrar as regras da API Gemini
if (typeof window !== 'undefined') {
  (window as any).process = (window as any).process || { env: {} };
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
