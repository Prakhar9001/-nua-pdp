import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

// Only active during `vitest run` — intercepts .module.scss before vite:css can parse them,
// returning an identity-proxy so class name lookups still work in tests.
function cssModulesMock(): Plugin {
  return {
    name: 'test-css-modules-mock',
    enforce: 'pre',
    resolveId(id) {
      if (process.env.VITEST && id.endsWith('.module.scss')) {
        return '\0css-noop:' + id.replace('.scss', '');
      }
    },
    load(id) {
      if (id.startsWith('\0css-noop:')) {
        return `export default new Proxy({}, { get: (_, key) => key })`;
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), cssModulesMock()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    css: false,
  },
});
