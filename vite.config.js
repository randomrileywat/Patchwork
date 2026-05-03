import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Project-page deployment under https://<user>.github.io/patchwork/
export default defineConfig({
  base: '/patchwork/',
  plugins: [react()],
});
