module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'quotes': [
      2,
      'single'
    ],
    'indent': [
      2,
      2,
      {
        'VariableDeclarator': 'first',
        'FunctionDeclaration': {
          'parameters': 'first'
        },
        'CallExpression': {
          'arguments': 'first'
        },
        'ArrayExpression': 1,
        'ObjectExpression': 1,
        'SwitchCase': 1
      }
    ],
    'array-bracket-spacing': [
      2,
      'never'
    ],
    'object-curly-spacing': [
      2,
      'always',
      {
        'objectsInObjects': false,
        'arraysInObjects': false
      }
    ],
    'computed-property-spacing': [
      2,
      'never'
    ],
    'space-in-parens': [
      2,
      'never'
    ],
    'comma-spacing': [
      2,
      {
        'before': false,
        'after': true
      }
    ],
    'no-undef-init': 2,
    'no-void': 2,
    'no-undefined': 2,
    'no-shadow-restricted-names': 2,
    'semi': [
      2,
      'always',
      {
        'omitLastInOneLineBlock': false
      }
    ]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
