import { defineConfig } from "vitest/config";

import viteConfig from "./vite.config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  ...viteConfig,
  plugins: [react()],
  test: {
    environment: "jsdom",
  },
});
