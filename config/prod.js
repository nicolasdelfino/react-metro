import babel from 'rollup-plugin-babel'
import cjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import globals from 'rollup-plugin-node-globals'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  entry: 'src/index.js',
  format: 'cjs',
  exports: 'named',
  moduleName: 'reactMetro',
  dest: 'dist/react-metro.js',
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [['es2015', { modules: false }], 'stage-0', 'react'],
      plugins: ['external-helpers']
    }),
    nodeResolve({
      jsnext: true,
      module: true,
      main: true,
      browser: true
    }),
    cjs({
      exclude: ['node_modules/process-es6/**'],
      include: ['node_modules/**'],
      namedExports: {
        'node_modules/gsap/TweenMax.js': ['TweenMax']
      }
    }),
    globals(),
    uglify()
  ],
  sourceMap: false
}
