import babel from 'rollup-plugin-babel'
import cjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import globals from 'rollup-plugin-node-globals'
import nodeResolve from 'rollup-plugin-node-resolve'
import autoExternal from 'rollup-plugin-auto-external'
import cleanup from 'rollup-plugin-cleanup'

export default {
  input: 'src/index.js',
  output: {
    name: 'reactMetro',
    format: 'cjs',
    exports: 'named',
    file: 'dist/react-metro.js'
  },
  external: ['react'],
  treeshake: {
    propertyReadSideEffects: false
  },
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [
        [
          'es2015',
          {
            modules: false,
            loose: true
          }
        ],
        'stage-0',
        'react'
      ],
      plugins: ['external-helpers']
    }),
    nodeResolve({
      module: true,
      main: true,
      jsnext: true
    }),
    cjs({
      exclude: ['node_modules/process-es6/**'],
      include: ['node_modules/**']
    }),
    autoExternal({
      dependencies: true,
      peerDependencies: true
    }),
    globals(),
    cleanup(),
    uglify()
  ]
}
