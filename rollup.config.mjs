import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import dts from 'rollup-plugin-dts'

const input = ['src/index.ts']

export default defineConfig([
  {
    input,
    output: {
      format: 'cjs',
      file: 'dist/index.cjs',
    },
    plugins: [typescript({ tsconfig: './tsconfig.json' }), terser({})],
  },
  {
    input,
    output: {
      format: 'esm',
      file: 'dist/index.mjs',
    },
    plugins: [typescript({ tsconfig: './tsconfig.json' }), terser({})],
  },
  {
    input,
    output: {
      format: 'esm',
      file: 'dist/index.d.ts',
    },
    plugins: [dts()],
  },
])
