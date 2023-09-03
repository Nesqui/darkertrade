/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  plugins: ["prefer-arrow"],
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier/skip-formatting",
  ],
  // parser:'@vue-eslint-parser',
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "vue/no-mutating-props": ["error", {
      "shallowOnly": true
    }],
    'vue/multi-word-component-names': 'off',
    "prefer-arrow/prefer-arrow-functions": [
      "error",
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false,
      },
    ],
    "prefer-arrow-callback": ["error", { allowNamedFunctions: true }],
    "func-style": ["error", "expression", { allowArrowFunctions: true }],
  },
};
