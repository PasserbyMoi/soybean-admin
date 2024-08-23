import { defineConfig } from '@soybeanjs/eslint-config';

export default defineConfig(
  { vue: true, unocss: true },
  {
    rules: {
      complexity: ['error', { max: 50 }],
      'max-params': ["error", 5],
      'no-nested-ternary': 'off',
      'no-use-before-define': 'off',
      // 'allow-all-properties-on-same-line': true,
      '@typescript-eslint/no-use-before-define': 'off',
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index', 'App', 'Register', '[id]', '[url]']
        }
      ],
      'vue/component-name-in-template-casing': [
        'warn',
        'PascalCase',
        {
          registeredComponentsOnly: false,
          ignores: ['/^icon-/']
        }
      ],
      'unocss/order-attributify': 'off'
    }
  }
);
