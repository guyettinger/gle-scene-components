import { Meta, StoryObj } from "@storybook/react";
import { Vector3 } from "three";
import { SceneView } from "./SceneView";
import { Box } from "../Box";
import { SceneModel, SceneViewModel } from "../../models";
import { PointCloud } from "../PointCloud";

const meta: Meta<typeof SceneView> = {
    component: SceneView,
    title: "gle-scene-components/SceneView",
    argTypes: {},
};
export default meta;

type Story = StoryObj<typeof SceneView>;

const farmGeodeticCenter = new Vector3(-83.765350, 34.401279, 357.0)
const farmCameraGeodeticCenter = new Vector3(farmGeodeticCenter.x, farmGeodeticCenter.y, farmGeodeticCenter.z + 10)

const sceneModel: SceneModel = new SceneModel(
    'Scene1',
    <group>
        <Box position={[4, 0, 0]}/>
        <Box position={[0, 0, -4]}/>
        <Box position={[-4, 0, 0]}/>
        <PointCloud
            baseUrl="https://raw.githubusercontent.com/potree/potree/develop/pointclouds/lion_takanawa/"
            fileName="cloud.js"
            position={[0, 0, 0]}
        />
        <PointCloud
            baseUrl="https://raw.githubusercontent.com/potree/potree/develop/pointclouds/lion_takanawa/"
            fileName="cloud.js"
            position={[10, 0, 0]}
        />
    </group>,
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