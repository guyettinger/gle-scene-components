import { Meta, StoryObj } from "@storybook/react";
import { KeyboardEvent } from "react";
import { Euler, MathUtils, Vector3 } from "three";
import { SceneModel, SceneViewModel } from "../../models";
import { SceneView } from "./SceneView";
import { Box } from "../Box";
import { PointCloud } from "../PointCloud";
import { GaussianSplatCloud } from "../GaussianSplatCloud";
import { CoordinatedGroup } from "../CoordinatedGroup";
import { rotatePointCloudOctreeYUp } from "../../services";

const meta: Meta<typeof SceneView> = {
    component: SceneView,
    title: "gle-scene-components/SceneView",
    argTypes: {},
};
export default meta;

// well-known coordinates
const upperArenaLongitudeLatitudeHeight = new Vector3(-83.765350, 34.401279, 357.0)
const lowerArenaLongitudeLatitudeHeight = new Vector3(-83.76612684589652, 34.40024525982904, 350.0)
const railayBeachLongitudeLatitudeHeight = new Vector3(98.83703938567413, 8.012837715484707, 0)

type Story = StoryObj<typeof SceneView>;

export const Boxes: Story = (args: any) => {

    // create a scene with 3 boxes in the farm's upper arena
    const sceneModel: SceneModel = new SceneModel(
        'Scene1',
        <group>
            <Box position={[4, 0, 0]}/>
            <Box position={[0, 0, -4]}/>
            <Box position={[-4, 0, 0]}/>
        </group>,
        upperArenaLongitudeLatitudeHeight
    )

    const sceneViewModel: SceneViewModel = new SceneViewModel(
        'SceneView1',
        sceneModel
    )

    return (
        <SceneView data-testid="SceneView-id" sceneViewModel={sceneViewModel}/>
    )
}
Boxes.args = {};


export const PointClouds: Story = (args: any) => {

    // create a scene with 2 point clouds in the farm's upper arena
    const sceneModel: SceneModel = new SceneModel(
        'Scene1',
        <group>
            <PointCloud
                baseUrl="https://raw.githubusercontent.com/potree/potree/develop/pointclouds/lion_takanawa/"
                fileName="cloud.js"
                onPointCloudLoad={rotatePointCloudOctreeYUp}
                position={[0, -.75, 0]}
            />
            <PointCloud
                baseUrl="https://raw.githubusercontent.com/potree/potree/develop/pointclouds/lion_takanawa/"
                fileName="cloud.js"
                onPointCloudLoad={rotatePointCloudOctreeYUp}
                position={[10, -.75, 0]}
            />
        </group>,
        upperArenaLongitudeLatitudeHeight
    )

    const sceneViewModel: SceneViewModel = new SceneViewModel(
        'SceneView1',
        sceneModel
    )

    return (
        <SceneView data-testid="SceneView-id" sceneViewModel={sceneViewModel}/>
    )
}
PointClouds.args = {};

export const GaussianSplatClouds: Story = (args: any) => {
    // position of center of the splat cloud
    const positionX = 0
    const positionY = 3
    const positionZ = 0
    const position = new Vector3(positionX, positionY, positionZ)

    // rotation of the splat cloud
    const rotateX = MathUtils.degToRad(-30)
    const rotateY = MathUtils.degToRad(-45)
    const rotateZ = MathUtils.degToRad(180)
    const rotation = new Euler(rotateX, rotateY, rotateZ, 'ZYX')

    // create a scene with a garden splat cloud in the farm's upper arena
    const sceneModel: SceneModel = new SceneModel(
        'Scene1',
        <group>
            <GaussianSplatCloud baseUrl="./"
                                fileName="splats/garden/garden_high.splat"
                                position={position}
                                rotation={rotation}/>
        </group>,
        upperArenaLongitudeLatitudeHeight
    )

    const sceneViewModel: SceneViewModel = new SceneViewModel(
        'SceneView1',
        sceneModel
    )

    return (
        <SceneView data-testid="SceneView-id" sceneViewModel={sceneViewModel}/>
    )
}
GaussianSplatClouds.args = {};

export const Mixed: Story = (args: any) => {

    // create a scene with multiple types of 3D elements in the farm's upper arena
    const sceneModel: SceneModel = new SceneModel(
        'Scene1',
        <group>
            <Box position={[4, 0, 0]}/>
            <Box position={[0, 0, -4]}/>
            <Box position={[-4, 0, 0]}/>
            <PointCloud
                baseUrl="https://raw.githubusercontent.com/potree/potree/develop/pointclouds/lion_takanawa/"
                fileName="cloud.js"
                onPointCloudLoad={rotatePointCloudOctreeYUp}
                position={[0, -.75, 0]}
            />
            <PointCloud
                baseUrl="https://raw.githubusercontent.com/potree/potree/develop/pointclouds/lion_takanawa/"
                fileName="cloud.js"
                onPointCloudLoad={rotatePointCloudOctreeYUp}
                position={[10, -.75, 0]}
            />
        </group>,
        upperArenaLongitudeLatitudeHeight
    )

    const sceneViewModel: SceneViewModel = new SceneViewModel(
        'SceneView1',
        sceneModel
    )

    return (
        <SceneView data-testid="SceneView-id" sceneViewModel={sceneViewModel}/>
    )
}
Mixed.args = {};


export const CoordinatedGroups: Story = (args: any) => {

    // create a scene with boxes in the upper arena, the lower arena, and at Railay Beach
    const sceneModel: SceneModel = new SceneModel(
        'Scene1',
        <group>
            <CoordinatedGroup longitudeLatitudeHeight={upperArenaLongitudeLatitudeHeight}>
                <Box position={[0, 0, 0]}/>
                <Box position={[4, 0, 0]}/>
                <Box position={[0, 0, -4]}/>
                <Box position={[-4, 0, 0]}/>
                <Box position={[0, 4, 0]}/>
            </CoordinatedGroup>
            <CoordinatedGroup longitudeLatitudeHeight={lowerArenaLongitudeLatitudeHeight}>
                <Box position={[0, 0, 0]}/>
                <Box position={[4, 0, 0]}/>
                <Box position={[0, 0, -4]}/>
                <Box position={[-4, 0, 0]}/>
                <Box position={[0, 4, 0]}/>
            </CoordinatedGroup>
            <CoordinatedGroup longitudeLatitudeHeight={railayBeachLongitudeLatitudeHeight}>
                <Box position={[0, 0, 0]}/>
                <Box position={[4, 0, 0]}/>
                <Box position={[0, 0, -4]}/>
                <Box position={[-4, 0, 0]}/>
                <Box position={[0, 4, 0]}/>
            </CoordinatedGroup>
        </group>,
        upperArenaLongitudeLatitudeHeight
    )

    const sceneViewModel: SceneViewModel = new SceneViewModel(
        'SceneView1',
        sceneModel
    )


    // switch the camera between locations
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        let handledKey = false;
        switch (e.key) {
            case "1":
                sceneViewModel.moveCameraTo(upperArenaLongitudeLatitudeHeight)
                handledKey = true
                break

            case "2":
                sceneViewModel.moveCameraTo(lowerArenaLongitudeLatitudeHeight)
                handledKey = true
                break

            case "3":
                sceneViewModel.moveCameraTo(railayBeachLongitudeLatitudeHeight)
                handledKey = true
                break
        }

        if (!handledKey) return
        e.stopPropagation()
        e.preventDefault()
    }

    return (
        <SceneView data-testid="SceneView-id" tabIndex={0} sceneViewModel={sceneViewModel} onKeyDown={handleKeyDown}/>
    )
}
CoordinatedGroups.args = {};