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
          VITE_APPWRITE_NOTIFICATION_PROVIDER_ID: Schema.string(),
          VITE_DATABASE_ID: Schema.string(),
          VITE_EVENT_END_DATE: Schema.string(),
          VITE_STAMPS_TO_COLLECT: Schema.number(),
          VITE_STANDISTS_COLLECTION_ID: Schema.string(),
          VITE_SUBMISSIONS_COLLECTION_ID: Schema.string(),
          VITE_SUBMIT_FUNCTION_ID: Schema.string(),
          VITE_WHEEL_COLLECTION_ID: Schema.string(),
          VITE_CONTEST_PARTICIPANTS_COLLECTION_ID: Schema.string(),
          VITE_GET_PRIVATE_KEY_FUNCTION_ID: Schema.string(),
          VITE_KV_COLLECTION_ID: Schema.string(),
          VITE_ASSETS_BUCKET_ID: Schema.string(),
          VITE_FIREBASE_API_KEY: Schema.string(),
          VITE_FIREBASE_AUTH_DOMAIN: Schema.string(),
          VITE_FIREBASE_PROJECT_ID: Schema.string(),
          VITE_FIREBASE_STORAGE_BUCKET: Schema.string(),
          VITE_FIREBASE_MESSAGING_SENDER_ID: Schema.string(),
          VITE_FIREBASE_APP_ID: Schema.string(),
          VITE_FIREBASE_VAPID_PUBLIC_KEY: Schema.string(),
          VITE_SENTRY_DSN: Schema.string(),
          VITE_SENTRY_ENVIRONMENT: Schema.string(),
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
              ? `Cloudflare Preview for ${process.env.CF_PAGES_BRANCH}`
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
