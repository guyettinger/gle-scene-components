import type { Preview } from "@storybook/react";
import { Ion } from "cesium";

Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjOWIzZmM0Mi0zOThjLTRmZjItOTM2OC1iOWM4N2ZiMzY3MzUiLCJpZCI6MTYzOTg4LCJpYXQiOjE2OTM2MDMzMzl9.SkbJ2XbsBVeaGSZ2MrwuksCHx4xuux3DGYh6pIJJhGQ"

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
