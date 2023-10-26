import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsConfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __BUSTER__: JSON.stringify(new Date()),
  },
  plugins: [react(), tsConfigPaths()]
})
