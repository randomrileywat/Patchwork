import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Project-page deployment under https://<user>.github.io/Patchwork/
export default defineConfig({
  base: '/Patchwork/',
  plugins: [react()],
});
