import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/handlers/health.ts', 'src/handlers/projects.ts', 'src/handlers/members.ts'],
  format: ['esm'],
  target: 'node20',
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist/handlers',
});
