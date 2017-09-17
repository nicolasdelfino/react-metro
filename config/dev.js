// Rollup plugins.
import babel from 'rollup-plugin-babel'
import cjs from 'rollup-plugin-commonjs'
import globals from 'rollup-plugin-node-globals'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  dest: 'dist/react-metro.js',
  entry: 'src/index.js',
  format: 'iife',
  sourceMap: true,
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [ [ 'es2015', { modules: false } ], 'stage-0', 'react' ],
      plugins: [ 'external-helpers' ]
    }),
    nodeResolve({
      jsnext: true,
      module: true,
      main: true,
      browser: true,
    }),
    cjs({
      exclude: ['node_modules/process-es6/**'],
      include: [
        'node_modules/**'
      ],
      namedExports: {
          'node_modules/gsap/TweenMax.js': [ 'TweenMax' ],
      }
    }),
    globals()
  ]
}
