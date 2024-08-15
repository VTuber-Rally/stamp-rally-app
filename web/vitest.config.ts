import { defineConfig } from "vitest/config";

import viteConfig from "./vite.config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  ...viteConfig,
  plugins: [
    react(),
    {
      name: "crypto-polyfill",
      config(config) {
        if (!config.test?.browser?.enabled) {
          return {
            test: {
              setupFiles: ["./vitest.setup.crypto.ts"],
            },
          };
        }
      },
    },
  ],
  test: {
    setupFiles: ["./vitest.setup.ts"],
    environment: "jsdom",
  },
});
