import reactRefresh from "eslint-plugin-react-refresh";
import storybook from "eslint-plugin-storybook";
import { FlatCompat } from "@eslint/eslintrc";

import js from "@eslint/js";
import typescript from "typescript-eslint";
import pluginRouter from '@tanstack/eslint-plugin-router'

const compat = new FlatCompat();

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      "**/*dist",
      "storybook-static/",
      "!.storybook",
      "**/.eslintrc.cjs",
      "src/routeTree.gen.ts"
    ],
  },
  js.configs.recommended,
  reactRefresh.configs.recommended,
  ...typescript.configs.recommended,
  ...storybook.configs["flat/recommended"],
  ...compat.extends("plugin:react-hooks/recommended"),
  ...pluginRouter.configs['flat/recommended'],
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
  {},
];
