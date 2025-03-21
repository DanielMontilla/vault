/** @type {import('prettier').Config} */
const config = {
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "avoid",
  experimentalTernaries: true,
  experimentalOperatorPosition: "start",

  printWidth: 80,
  plugins: ["prettier-plugin-organize-imports"],
};

export default config;
