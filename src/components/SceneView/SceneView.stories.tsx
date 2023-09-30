import { Meta, StoryObj } from "@storybook/react";
import SceneView from "./SceneView";
import { Box } from "./Box";
import { SceneModel } from "./models/sceneModel";

import { Ion } from "cesium";
import 'cesium/Build/Cesium/Widgets/widgets.css'
(window as any).CESIUM_BASE_URL = './dist'
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjOWIzZmM0Mi0zOThjLTRmZjItOTM2OC1iOWM4N2ZiMzY3MzUiLCJpZCI6MTYzOTg4LCJpYXQiOjE2OTM2MDMzMzl9.SkbJ2XbsBVeaGSZ2MrwuksCHx4xuux3DGYh6pIJJhGQ';

const meta: Meta<typeof SceneView> = {
    component: SceneView,
    title: "gle-scene-components/SceneView",
    argTypes: {},
};
export default meta;

type Story = StoryObj<typeof SceneView>;

const sceneModel:SceneModel = new SceneModel()
sceneModel.name = 'Scene1'
sceneModel.threeScene = (
    <Box position={[0, 0, 0]}/>
)

export const Primary: Story = (args:any) => (
    <SceneView data-testId="SceneView-id" {...args} />
);
Primary.args = {
    sceneModel: sceneModel,
    sceneViewName: "SceneView1"
};