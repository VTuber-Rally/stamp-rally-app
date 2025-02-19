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
    VITE_WHEEL_COLLECTION_ID: "WHEEL_COLLECTION_ID",
    VITE_SUBMIT_FUNCTION_ID: "SUBMIT_FUNCTION_ID",
    VITE_GET_PRIVATE_KEY_FUNCTION_ID: "GET_PRIVATE_KEY_FUNCTION_ID",
  }),
  async viteFinal(config) {
    const vitePWAPluginIndex = config.plugins.findIndex(
      (pluginDefinition) =>
        Array.isArray(pluginDefinition) &&
        typeof pluginDefinition[0] === "object" &&
        "name" in pluginDefinition[0] &&
        pluginDefinition[0].name === "vite-plugin-pwa",
    );

    if (vitePWAPluginIndex === -1) {
      throw new Error("VitePWA plugin does not exist");
    }

    const newPlugins = config.plugins.slice();
    newPlugins.splice(vitePWAPluginIndex, 1);

    return { ...config, plugins: newPlugins };
  },
};

export default config;
