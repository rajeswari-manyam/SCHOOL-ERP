import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'  // <-- import path

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(),
    react(),
    babel({
      presets: [reactCompilerPreset()],
      // Strip console.* calls from production builds only — keeps them
      // available during `vite dev` for debugging, removes them from the
      // shipped bundle so nothing internal (API shapes, stack traces) leaks
      // into a customer's browser console. This project's build pipeline is
      // Rolldown-based (not esbuild), which doesn't honor `esbuild.drop`, so
      // stripping happens here at the Babel transform step instead, which
      // always runs regardless of the downstream bundler/minifier.
      plugins: command === 'build' ? ['transform-remove-console'] : [],
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')  // <-- add this
    },
  },
}))