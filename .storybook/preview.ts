import type { Preview } from "@storybook/react";
import { Ion } from "cesium";

Ion.defaultAccessToken = (import.meta as any).env.STORYBOOK_CESIUM_ACCESS_TOKEN

console.log("import.meta", import.meta)

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
