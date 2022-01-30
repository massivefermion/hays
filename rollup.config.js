import ts from '@rollup/plugin-typescript'

export default {
  input: 'src/hays.ts',
  output: [
    { dir: 'dist/esm', format: 'esm' },
    { dir: 'dist/cjs', format: 'cjs' },
  ],
  plugins: [ts({ lib: ['es6'], tsconfig: false, target: 'es6' })],
}
