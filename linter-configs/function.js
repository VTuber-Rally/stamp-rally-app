// @ts-check
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import {
  config as defineConfig,
  configs as typescriptConfigs,
} from "typescript-eslint";

export const functionESLintConfig = defineConfig([
  {
    ignores: ["dist/", "eslint.config.mjs"],
  },
  js.configs.recommended,
  typescriptConfigs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  eslintConfigPrettier,
]);
