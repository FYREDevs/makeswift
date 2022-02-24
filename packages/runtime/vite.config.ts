import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: false,
    sourcemap: true,
    minify: false,
    // @ts-expect-error: we provide `build.rollupOptions.input` so `build.lib.entry` isn't required.
    lib: { formats: ['es', 'cjs'] },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src'),
        ['prop-controllers']: path.resolve(__dirname, 'src', 'prop-controllers'),
        react: path.resolve(__dirname, 'src', 'react'),
        ['box-model']: path.resolve(__dirname, 'src', 'box-model'),
        components: path.resolve(__dirname, 'src', 'components'),
      },
      output: {
        entryFileNames: '[name].[format].js',
        chunkFileNames: '[name].[format].js',
      },
      external: ['react', 'styled-components'],
    },
  },
})
