import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: ["./public", "../public"],
  env: (config) => ({
    ...config,
    VITE_APPWRITE_ENDPOINT: `https://cloud.appwrite.io/v1`,
    VITE_APPWRITE_PROJECT_ID: "PROJECT_ID",
    VITE_DATABASE_ID: "DB_ID",
    VITE_STANDISTS_COLLECTION_ID: "STANDISTS_COLLECTION_ID",
    VITE_STAMPS_COLLECTION_ID: "STAMPS_COLLECTION_ID",
    VITE_SUBMISSIONS_COLLECTION_ID: "SUBMISSIONS_COLLECTION_ID",
    VITE_PRIZES_COLLECTION_ID: "WHEEL_COLLECTION_ID",
    VITE_SUBMIT_FUNCTION_ID: "SUBMIT_FUNCTION_ID",
    VITE_GET_PRIVATE_KEY_FUNCTION_ID: "GET_PRIVATE_KEY_FUNCTION_ID",
  }),
};

export default config;
