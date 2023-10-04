import { Meta, StoryObj } from "@storybook/react";
import { Vector3 } from "three";
import { SceneView } from "./SceneView";
import { Box } from "../Box";
import { SceneModel, SceneViewModel } from "../../models";

const meta: Meta<typeof SceneView> = {
    component: SceneView,
    title: "gle-scene-components/SceneView",
    argTypes: {},
};
export default meta;

type Story = StoryObj<typeof SceneView>;

const farmGeodeticCenter = new Vector3(-83.764977, 34.401379, 400.0)
const farmCameraGeodeticCenter = new Vector3(farmGeodeticCenter.x, farmGeodeticCenter.y, farmGeodeticCenter.z + 100)

const sceneModel: SceneModel = new SceneModel(
    'Scene1',
    <Box position={[0, 0, 0]}/>,
    farmGeodeticCenter
)

const sceneViewModel: SceneViewModel = new SceneViewModel(
    'SceneView1',
    sceneModel,
    farmCameraGeodeticCenter
)

export const Farm: Story = (args: any) => (
    <SceneView data-testId="SceneView-id" {...args} />
);
Farm.args = {
    sceneViewModel: sceneViewModel
};