
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Removemos o 'define' manual para deixar o Vite gerenciar as variáveis de ambiente
  // através do import.meta.env ou do plugin react de forma nativa.
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  }
});
