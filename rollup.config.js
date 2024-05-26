import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.js',
      format: 'iife',
      sourcemap: true,
    },
    plugins: [
      nodeResolve({ preferBuiltins: false }),
      commonjs(),
    ],
  };