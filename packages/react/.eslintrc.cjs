/** @type {import("eslint").Linter.Config} */

module.exports = {
  root: true,
  extends: ['@didit-sdk/eslint-config/base.js', 'plugin:require-extensions/recommended'],
  plugins: ['require-extensions']
}
