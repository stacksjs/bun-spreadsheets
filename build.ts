import { dts } from 'bun-plugin-dts-auto'

await Bun.build({
  entrypoints: ['src/index.ts'],
  outdir: './dist',
  sourcemap: 'linked',
  minify: true,
  plugins: [dts()],
})
