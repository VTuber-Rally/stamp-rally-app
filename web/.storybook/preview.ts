import type { Preview } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";

import "@fontsource-variable/comfortaa";
import "../src/index.css";

// Initialize MSW
initialize();

// i18n
import "@/lib/i18n.ts";
import { I18nextDecorator } from "../src/lib/decorators";

// Viewports
import { MINIMAL_VIEWPORTS } from "@storybook/addon-viewport";
import { http, HttpResponse } from "msw";
import { StandistsFromAppwrite } from "../src/stubs/Standists";
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
      handlers: [
        http.get(
          "https://appwrite.luc.ovh/v1/databases/6675f377000709b0db07/collections/6675f3a2000e52a39b67/documents",
          () => HttpResponse.json(StandistsFromAppwrite),
        ),
      ],
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
