import { Schema, ValidateEnv } from "@julr/vite-plugin-validate-env";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import { VitePWA } from "vite-plugin-pwa";

const MAX_SENTRY_DEPLOY_NAME_LENGTH = 64 as const;

// https://vitejs.dev/config/
export default defineConfig({
  // configure @ for src directory
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~": path.resolve(__dirname, "./convex"),
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
          VITE_STANDARD_REWARD_MIN_STAMPS_REQUIREMENT: Schema.number(),
          VITE_PREMIUM_REWARD_MIN_STAMPS_REQUIREMENT: Schema.number(),
          VITE_IS_MINOR_HALL_REQUIRED: Schema.boolean(),
          VITE_MAP_TILES_URL: Schema.string(),
          VITE_FIREBASE_API_KEY: Schema.string(),
          VITE_FIREBASE_AUTH_DOMAIN: Schema.string(),
          VITE_FIREBASE_PROJECT_ID: Schema.string(),
          VITE_FIREBASE_STORAGE_BUCKET: Schema.string(),
          VITE_FIREBASE_MESSAGING_SENDER_ID: Schema.string(),
          VITE_FIREBASE_APP_ID: Schema.string(),
          VITE_FIREBASE_VAPID_PUBLIC_KEY: Schema.string(),
          VITE_SENTRY_DSN: Schema.string(),
          VITE_SENTRY_ENVIRONMENT: Schema.string(),
          VITE_INDEXEDDB_NAME: Schema.string(),
          VITE_CONVEX_URL: Schema.string(),
        },
      }),
    // This plugin is disabled in Storybook
    process.env.STORYBOOK !== "true" &&
      VitePWA({
        registerType: "autoUpdate",
        strategies: "injectManifest",
        manifest: {
          name: "VTuber Stamp Rally",
          short_name: "Stamp Rally",
          theme_color: "#8bceba",
          display: "browser",
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
        injectManifest: {
          // https://vite-pwa-org.netlify.app/guide/static-assets#globpatterns
          globPatterns: ["**/*.{woff2,js,css,html,jpg,svg,png}"],
        },
        srcDir: "src",
        filename: "serviceWorker.ts",
        devOptions: {
          enabled: true,
          type: "module",
        },
      }),
    mkcert({ savePath: "./certs" }),
    TanStackRouterVite(),
    react(),
    tailwindcss(),
    sentryVitePlugin({
      org: process.env.VITE_SENTRY_ORG_ID,
      project: process.env.VITE_SENTRY_PROJECT_ID,
      telemetry: false,
      disable: process.env.CF_PAGES !== "1" || process.env.STORYBOOK === "true",
      release: {
        name: process.env.CF_PAGES_COMMIT_SHA,
        dist: new Date().toISOString(),
        deploy: {
          name:
            process.env.VITE_SENTRY_ENVIRONMENT === "preview"
              ? `Cloudflare Preview for ${process.env.CF_PAGES_BRANCH}`.substring(
                  0,
                  MAX_SENTRY_DEPLOY_NAME_LENGTH,
                ) // Tronquer pour respecter la limite de 64 caractères
              : "Cloudflare Pages production",
          env: process.env.VITE_SENTRY_ENVIRONMENT ?? "production",
          url: process.env.CF_PAGES_URL,
        },
        setCommits: {
          repo: process.env.VITE_SENTRY_REPO!,
          commit: process.env.CF_PAGES_COMMIT_SHA!,
          ignoreEmpty: true,
        },
      },
      sourcemaps: {
        filesToDeleteAfterUpload: ["**/*.js.map"],
      },
    }),
  ],
  define: {
    BUILD_TIMESTAMP: new Date(),
  },
});
