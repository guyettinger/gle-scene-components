import { Meta, StoryObj } from "@storybook/react";
import { Vector3 } from "three";
import { Box } from "../Box";
import { SceneModel, SceneViewModel } from "../../models";
import { SceneViewInformation } from "./SceneViewInformation";

const meta: Meta<typeof SceneViewInformation> = {
    component: SceneViewInformation,
    title: "gle-scene-components/SceneViewInformation",
    argTypes: {},
};
export default meta;

type Story = StoryObj<typeof SceneViewInformation>;

export const Farm: Story = (args: any) => {
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

    return (
        <SceneViewInformation data-testId="SceneView-id" sceneViewModel={sceneViewModel}/>
    )
}

Farm.args = {};