module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'linebreak-style': 'off',
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'no-param-reassign': 'off',
    'max-len': 'off',
    // 'global-require': 'off',
    // 'consistent-return': 'off',
    // 'object-curly-spacing': [
    //   'error',
    //   'always',
    // ],
    // 'vue/mustache-interpolation-spacing': 'warning',
    // 'vue/no-multi-spaces': 'warning',
    // 'vue/valid-v-bind': 'off',
    // 'vue/no-parsing-error': 'off',
    // 'vue/attributes-order': 'error',
    // 'vue/order-in-components': 'error',
  },

  parserOptions: {
    parser: 'babel-eslint',
  },

  'extends': [
    'plugin:vue/recommended',
    '@vue/airbnb'
  ],

};
