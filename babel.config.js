'use strict';

export default {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '14',
          browsers: [
            'last 2 versions',
            '> 1%',
            'not dead'
          ]
        },
        modules: 'commonjs',
        useBuiltIns: 'usage',
        corejs: 3
      }
    ]
  ]
}
