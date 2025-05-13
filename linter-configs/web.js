// @ts-check
import js from "@eslint/js";
import pluginRouter from "@tanstack/eslint-plugin-router";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import * as reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import storybook from "eslint-plugin-storybook";
import {
  config as defineConfig,
  configs as typescriptConfigs,
} from "typescript-eslint";

export const webESLintConfig = defineConfig([
  {
    ignores: [
      "**/*dist",
      "storybook-static/",
      "!.storybook",
      ".storybook/public/mockServiceWorker.js",
      "**/.eslintrc.cjs",
      "src/routeTree.gen.ts",
      "eslint.config.mjs",
    ],
  },
  js.configs.recommended,
  typescriptConfigs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": [
        "error",
        {
          allowForKnownSafeCalls: [
            {
              from: "package",
              name: "invalidateQueries",
              package: "@tanstack/query-core",
            },
          ],
        },
      ],
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            arguments: false,
            attributes: false,
          },
        },
      ],
    },
  },
  reactRefresh.configs.recommended,
  storybook.configs["flat/recommended"],
  pluginRouter.configs["flat/recommended"],
  reactHooks.configs["recommended-latest"],
  eslintConfigPrettier,
  {
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],
    },
  },
  {
    // Disable require await on test files
    // this is because of some weirdness in RTL
    files: ["**/*.test.tsx"],
    rules: {
      "@typescript-eslint/require-await": "off",
    },
  },
]);
