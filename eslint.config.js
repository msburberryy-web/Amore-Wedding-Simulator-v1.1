import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default [
  { ignores: ["dist/"] },
  { languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: { 
      react: pluginReact,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['warn'],
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
    },
  },
];
