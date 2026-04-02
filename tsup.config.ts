import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/base/index.ts',
    'src/base/bubble.ts',
    'src/base/insertion.ts',
    'src/base/selection.ts',
    'src/base/merge.ts',
    'src/base/quick.ts',
    'src/base/heap.ts',
    'src/meme/index.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: false,
  clean: true,
  minify: false,
  treeshake: true,
  outDir: 'dist',
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
    };
  },
});
