import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

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
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "VTuber Stamp Rally",
        short_name: "Stamp Rally",
        theme_color: "#9fe0ea",
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
      },
    }),
    mkcert({ savePath: "./certs" }),
    TanStackRouterVite(),
    react(),
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
