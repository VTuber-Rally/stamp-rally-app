import { Schema, ValidateEnv } from "@julr/vite-plugin-validate-env";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  // configure @ for src directory
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: ["firefox100", "chrome90", "edge90", "safari15"],
    sourcemap: true,
  },
  plugins: [
    process.env.STORYBOOK !== "true" &&
      ValidateEnv({
        debug: true,
        validator: "builtin",
        schema: {
          VITE_APPWRITE_ENDPOINT: Schema.string(),
          VITE_APPWRITE_PROJECT_ID: Schema.string(),
          VITE_DATABASE_ID: Schema.string(),
          VITE_EVENT_END_DATE: Schema.string(),
          VITE_STAMPS_TO_COLLECT: Schema.number(),
          VITE_STANDISTS_COLLECTION_ID: Schema.string(),
          VITE_SUBMISSIONS_COLLECTION_ID: Schema.string(),
          VITE_SUBMIT_FUNCTION_ID: Schema.string(),
          VITE_WHEEL_COLLECTION_ID: Schema.string(),
          VITE_GET_PRIVATE_KEY_FUNCTION_ID: Schema.string(),
          VITE_ASSETS_BUCKET_ID: Schema.string(),
        },
      }),
    // This plugin is disabled in Storybook
    process.env.STORYBOOK !== "true" &&
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "VTuber Stamp Rally",
          short_name: "Stamp Rally",
          theme_color: "#8bceba",
          display: "standalone",
          categories: ["entertainment"],
          orientation: "portrait",
          dir: "ltr",
          icons: [
            {
              src: "/icons/favicon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable any",
            },
            {
              src: "/icons/favicon-180.png",
              sizes: "180x180",
              type: "image/png",
              purpose: "maskable any",
            },
          ],
        },
        includeAssets: ["**/*"],
        workbox: {
          // https://vite-pwa-org.netlify.app/guide/static-assets#globpatterns
          globPatterns: ["**/*.{woff2,js,css,html,jpg,svg,png}"],
          runtimeCaching: [
            {
              urlPattern: /v1\/storage\/buckets.+$/,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "rally-assets",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24, // 24 heures?
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: "module",
        },
      }),
    mkcert({ savePath: "./certs" }),
    TanStackRouterVite(),
    react(),
    tailwindcss(),
    process.env.NODE_ENV === "production" &&
      sentryVitePlugin({
        org: "japex-rally",
        project: "javascript-react",
        telemetry: false,
        sourcemaps: {
          filesToDeleteAfterUpload: ["**/*.js.map"],
        },
      }),
  ],
  define: {
    BUILD_TIMESTAMP: new Date(),
  },
});
