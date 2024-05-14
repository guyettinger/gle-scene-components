import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import cesium from "vite-plugin-cesium";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-onboarding",
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
    docs: {
        autodocs: "tag",
    },
    viteFinal(config) {
        return mergeConfig(config, {
            base: "",
            define: {
              "process.env.NEXT_PUBLIC_CESIUM_ACCESS_TOKEN": process.env.NEXT_PUBLIC_CESIUM_ACCESS_TOKEN
            },
            plugins: [cesium()],
        });
    }
};
export default config;
