import type { Preview } from "@storybook/react";
import { Ion } from "cesium";

Ion.defaultAccessToken = (import.meta as any).env.STORYBOOK_CESIUM_ACCESS_TOKEN ?? (import.meta as any).env.NEXT_PUBLIC_CESIUM_ACCESS_TOKEN

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
