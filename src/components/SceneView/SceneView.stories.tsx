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
import styled from "styled-components";

const meta: Meta<typeof SceneView> = {
    component: SceneView,
    title: "gle-scene-components/SceneView",
    argTypes: {},
};
export default meta;

type Story = StoryObj<typeof SceneView>;

export const Boxes: Story = (args: any) => {

    // coordinates
    const upperArenaLongitudeLatitudeHeight = new Vector3(-83.765350, 34.401279, 357.0)

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

export const AnimatedBoxes: Story = (args: any) => {

    // coordinates
    const upperArenaLongitudeLatitudeHeight = new Vector3(-83.765350, 34.401279, 357.0)

    // create a scene with 3 boxes in the farm's upper arena
    const sceneModel: SceneModel = new SceneModel(
        'Scene1',
        <group>
            <Box position={[4, 0, 0]} animate={true}/>
            <Box position={[0, 0, -4]} animate={true}/>
            <Box position={[-4, 0, 0]} animate={true}/>
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
AnimatedBoxes.args = {};


export const PointClouds: Story = (args: any) => {

    // coordinates
    const upperArenaLongitudeLatitudeHeight = new Vector3(-83.765350, 34.401279, 357.0)

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

    // coordinates
    const upperArenaLongitudeLatitudeHeight = new Vector3(-83.765350, 34.401279, 357.0)

    // position of center of the splat cloud
    const positionX = 0
    const positionY = 2
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
                                fileName="splats/ornament/ornament.splat"
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

    // coordinates
    const upperArenaLongitudeLatitudeHeight = new Vector3(-83.765350, 34.401279, 357.0)

    // rotation of the splat cloud
    const rotateX = MathUtils.degToRad(-30)
    const rotateY = MathUtils.degToRad(-45)
    const rotateZ = MathUtils.degToRad(180)
    const rotation = new Euler(rotateX, rotateY, rotateZ, 'ZYX')

    // create a scene with multiple types of 3D elements in the farm's upper arena
    const sceneModel: SceneModel = new SceneModel(
        'Scene1',
        <group>
            <Box position={[-4, 0, 0]}/>
            <PointCloud
                baseUrl="https://raw.githubusercontent.com/potree/potree/develop/pointclouds/lion_takanawa/"
                fileName="cloud.js"
                onPointCloudLoad={rotatePointCloudOctreeYUp}
                position={[0, -.75, 0]}
            />
            <GaussianSplatCloud baseUrl="./"
                                fileName="splats/ornament/ornament.splat"
                                position={[4,2,0]}
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
Mixed.args = {};

const SceneButton = styled.button`
  position: relative;
  margin-right: 10px;
  padding: 4px 8px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.25);
  border: 1px rgba(0, 0, 0, 0.25);
  border-radius: 4px;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
    border: 1px rgba(0, 0, 0, 0.5);
  }
`


export const CoordinatedGroups: Story = (args: any) => {

    // coordinates
    const upperArenaLongitudeLatitudeHeight = new Vector3(-83.765350, 34.401279, 357.0)
    const lowerArenaLongitudeLatitudeHeight = new Vector3(-83.76612684589652, 34.40024525982904, 350.0)
    const railayBeachLongitudeLatitudeHeight = new Vector3(98.83703938567413, 8.012837715484707, 0)

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

    return (
        <>
            <SceneButton onClick={()=>sceneViewModel.moveCameraToLongitudeLatitudeHeight(upperArenaLongitudeLatitudeHeight)}>
                Upper Arena
            </SceneButton>
            <SceneButton onClick={()=>sceneViewModel.moveCameraToLongitudeLatitudeHeight(lowerArenaLongitudeLatitudeHeight)}>
                Lower Arena
            </SceneButton>
            <SceneButton onClick={()=>sceneViewModel.moveCameraToLongitudeLatitudeHeight(railayBeachLongitudeLatitudeHeight)}>
                Railay Beach
            </SceneButton>
            <SceneView data-testid="SceneView-id" tabIndex={0} sceneViewModel={sceneViewModel}/>
        </>
    )
}
CoordinatedGroups.args = {};