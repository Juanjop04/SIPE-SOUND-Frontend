import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["dist/**", "node_modules/**", ".scannerwork/**"] },
  { files: ["**/*.{js,jsx,ts,tsx}"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  jsxA11y.flatConfigs.recommended,
  sonarjs.configs.recommended,
  {
    plugins: { "react-hooks": reactHooks },
    settings: { react: { version: "detect" } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react/prop-types": "off",
      // TypeScript resuelve identificadores; typescript-eslint desaconseja no-undef.
      "no-undef": "off",
      "no-console": ["error", { allow: ["error"] }],
      "sonarjs/cognitive-complexity": ["error", 15],
      "max-lines-per-function": ["warn", { max: 80, skipComments: true }],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["../../*"], message: "Usa el alias @/" },
            { group: ["@/features/*/*"], message: "Importa desde el index.ts de la feature" },
          ],
        },
      ],
    },
  },
  {
    files: ["src/shared/**"],
    rules: {
      "no-restricted-imports": ["error", { patterns: ["@/features/*", "@/app/*"] }],
    },
  },
];
