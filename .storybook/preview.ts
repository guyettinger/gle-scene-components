import type { Preview } from "@storybook/react";
import { Ion } from "cesium";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_CESIUM_ACCESS_TOKEN: string;
    }
  }
}

Ion.defaultAccessToken = (import.meta as any).env.VITE_CESIUM_ACCESS_TOKEN ?? process.env.NEXT_PUBLIC_CESIUM_ACCESS_TOKEN

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
