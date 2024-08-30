import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import cesium from "vite-plugin-cesium";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "@storybook/addon-docs",
        "@storybook/addon-storysource"
    ],

    framework: {
        name: "@storybook/react-vite",
        options: {},
    },

    staticDirs: [
        { from: '../public', to: '/' }
    ],

    docs: {},

    viteFinal(config) {
        return mergeConfig(config, {
            base: "",
            plugins: [cesium()],
        });
    },

    typescript: {
        reactDocgen: "react-docgen-typescript"
    }
};
export default config;
