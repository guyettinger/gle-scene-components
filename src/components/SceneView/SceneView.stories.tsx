import { Meta, StoryObj } from "@storybook/react";
import SceneView from "./SceneView";
import { Box } from "../Box";
import { SceneModel, SceneViewModel } from "../../models";
import { Vector3 } from "three";

const meta: Meta<typeof SceneView> = {
    component: SceneView,
    title: "gle-scene-components/SceneView",
    argTypes: {},
};
export default meta;

type Story = StoryObj<typeof SceneView>;

const farmGeodeticCenter = new Vector3(-83.764977, 34.401379, 400.0)
const geodeticCenter = new Vector3(farmGeodeticCenter.x, farmGeodeticCenter.y, farmGeodeticCenter.z + 100)

const sceneModel: SceneModel = new SceneModel(
    'Scene1',
    <Box position={[0, 0, 0]}/>,
    geodeticCenter
);

const sceneViewModel: SceneViewModel = new SceneViewModel(
    'SceneView1',
    sceneModel,
    geodeticCenter)

export const Farm: Story = (args: any) => (
    <SceneView data-testId="SceneView-id" {...args} />
);
Farm.args = {
    sceneViewModel: sceneViewModel
};