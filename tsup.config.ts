import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/sorted/**/index.ts', 'src/types/index.ts', 'src/utils/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: false,
  clean: true,
  minify: true,
  treeshake: true,
  outDir: 'dist',
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
    };
  },
});
