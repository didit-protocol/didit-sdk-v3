/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "plugin:require-extensions/recommended",
    "@didit-sdk/eslint-config/base.js"
  ],
  plugins: ["require-extensions"],
};
