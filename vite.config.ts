import { defineConfig } from 'vite';
// import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  build: {
    target: 'es2022',
  },
  resolve: {
    alias: {
      '~@lumino': 'node_modules/@lumino',
    },
  },
  optimizeDeps: {
    exclude: ['itk-wasm', '@itk-viewer/io'],
    // to fix "SyntaxError: The requested module '/node_modules/eventemitter3/index.js?v=2204426f' does not provide an export named 'default'"
    include: ['@itk-viewer/io > p-queue'],
  },
  plugins: [
    // collect lazy loaded JavaScript and Wasm bundles in public directory
    //   viteStaticCopy({
    //     targets: [
    //       {
    //         src: 'node_modules/.pnpm/@itk-viewer+blosc-zarr@0.1.3/node_modules/@itk-viewer/blosc-zarr/emscripten-build/*',
    //         dest: 'pipelines',
    //       },
    //     ],
    //   }),
  ],
});
