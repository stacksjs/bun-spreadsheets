import { dts } from 'bun-plugin-dts-auto'

await Bun.build({
  entrypoints: ['src/index.ts'],
  outdir: './dist',
  plugins: [dts()],
})
