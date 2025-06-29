import { globalIgnores } from "eslint/config";

import { functionESLintConfig } from "@vtube-stamp-rally/linter-configs/function";

export default [
  ...functionESLintConfig,
  ...[globalIgnores(["utils/**/index.js"])],
];
