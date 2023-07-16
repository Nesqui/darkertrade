module.exports = {
  $schema: "https://json.schemastore.org/prettierrc",
  plugins: ['./node_modules/@trivago/prettier-plugin-sort-imports'],
  semi: false,
  tabWidth: 2,
  singleQuote: true,
  printWidth: 100,
  trailingComma: "none",
  "importOrder": ["^@core/(.*)$", "^@server/(.*)$", "^@ui/(.*)$", "^[./]"],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true,
};
