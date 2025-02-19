import "@fontsource-variable/comfortaa";
// Viewports
import { MINIMAL_VIEWPORTS } from "@storybook/addon-viewport";
import type { Preview } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";

// i18n
import "@/lib/i18n.ts";

import "../src/index.css";
import { I18nextDecorator } from "../src/lib/decorators";
import { handlers } from "../src/msw";

// Initialize MSW
initialize();

const customViewports = {
  phone: {
    name: "Phone",
    styles: {
      width: "448px",
      height: "768px",
    },
  },
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      defaultViewport: "phone",
      viewports: {
        ...MINIMAL_VIEWPORTS,
        ...customViewports,
      },
    },
    msw: {
      handlers,
    },
  },
  loaders: [mswLoader],
  decorators: [I18nextDecorator],
};

export const globalTypes = {
  locale: {
    name: "Locale",
    description: "Internationalization locale",
    toolbar: {
      icon: "globe",
      items: [
        { value: "fr", title: "Français" },
        { value: "en", title: "English" },
      ],
      showName: true,
    },
  },
};

export default preview;
