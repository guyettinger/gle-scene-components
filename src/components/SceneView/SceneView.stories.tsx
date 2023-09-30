import { Meta, StoryObj } from "@storybook/react";
import SceneView from "./SceneView";
import { Box } from "./Box";
import { SceneModel } from "./models/sceneModel";

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