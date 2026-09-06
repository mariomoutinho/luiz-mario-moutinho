import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const githubPagesBase =
  repositoryName && !repositoryName.endsWith('.github.io') ? `/${repositoryName}/` : '/';

export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? githubPagesBase,
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
