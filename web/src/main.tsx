import "@fontsource-variable/comfortaa";
import * as Sentry from "@sentry/react";
import { createRoot } from "react-dom/client";

import { App } from "@/App.tsx";
import { isProd, sentryDSN, sentryEnvironment } from "@/lib/consts.ts";
// prefetch les standists
import { prefetchStandists } from "@/lib/hooks/useStandists.ts";
import "@/lib/i18n.ts";

import "./index.css";

void prefetchStandists();

if (isProd) {
  Sentry.init({
    dsn: sentryDSN,
    environment: sentryEnvironment,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

// Create Plausible fallback function
window.plausible ||= (...args) => {
  window.plausible.q?.push(args);
};

createRoot(document.getElementById("root")!).render(<App />);
