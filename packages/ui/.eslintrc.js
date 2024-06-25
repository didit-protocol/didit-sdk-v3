/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "plugin:wc/recommended",
    "plugin:lit/recommended",
    "plugin:require-extensions/recommended",
    "@didit-sdk/eslint-config/base.js"
  ],
  "plugins": ["require-extensions"],
  "rules": {
    "lit/attribute-value-entities": "off"
  },
};
