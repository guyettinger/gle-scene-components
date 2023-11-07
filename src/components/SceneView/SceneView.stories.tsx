import { Meta, StoryObj } from "@storybook/react";
import { MathUtils, Vector3 } from "three";
import styled from "styled-components";
import { SceneModel, SceneViewModel } from "../../models";
import { SceneView } from "./SceneView";
import { Box } from "../Box";
import { PointCloud } from "../PointCloud";
import { GaussianSplatCloud } from "../GaussianSplatCloud";
import { CoordinatedGroup } from "../CoordinatedGroup";
import { rotatePointCloudOctreeYUp } from "../../services";
import { GoogleMapsPhotorealistic3DTiles } from "../Cesium3DTilesets";

const meta: Meta<typeof SceneView> = {
    component: SceneView,
    title: "gle-scene-components/SceneView",
    argTypes: {},
};
export default meta;

type Story = StoryObj<typeof SceneView>;

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

export const Boxes: Story = (args: any) => {

    // coordinates
    const upperArenaLongitudeLatitudeHeight = new Vector3(-83.765350, 34.401279, 357.0)

    // create a scene with 3 boxes in the farm's upper arena
    const sceneModel: SceneModel = new SceneModel(
        'Scene1',
        upperArenaLongitudeLatitudeHeight,
        <group>
            <Box position={[4, 0, 0]}/>
            <Box position={[0, 0, -4]}/>
            <Box position={[-4, 0, 0]}/>
        </group>
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
        upperArenaLongitudeLatitudeHeight,
        <group>
            <Box position={[4, 0, 0]} animate={true}/>
            <Box position={[0, 0, -4]} animate={true}/>
            <Box position={[-4, 0, 0]} animate={true}/>
        </group>
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
        upperArenaLongitudeLatitudeHeight,
        <group>
            <PointCloud
                baseUrl="https://raw.githubusercontent.com/potree/potree/develop/pointclouds/lion_takanawa/"
                fileName="cloud.js"
                onPointCloudLoad={rotatePointCloudOctreeYUp}
                position={[0, -.75, 0]}
            />
        </group>
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

    // create a scene with a garden splat cloud in the farm's upper arena
    const sceneModel: SceneModel = new SceneModel(
        'Scene1',
        upperArenaLongitudeLatitudeHeight,
        <group>
            <GaussianSplatCloud baseUrl="./"
                                fileName="splats/ornament/ornament.splat"
                                position={[0, 2, 0]}
                                rotation={[
                                    MathUtils.degToRad(-30),
                                    MathUtils.degToRad(-45),
                                    MathUtils.degToRad(180), 'ZYX']}
            />
        </group>
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


export const CoordinatedGroups: Story = (args: any) => {

    // coordinates
    const upperArenaLongitudeLatitudeHeight = new Vector3(-83.765350, 34.401279, 357.0)
    const barnParkingLotLongitudeLatitudeHeight = new Vector3(-83.76536188233062, 34.400715493095205, 353.0)
    const lowerArenaLongitudeLatitudeHeight = new Vector3(-83.76612684589652, 34.40024525982904, 349.0)

    // create a scene with boxes in the upper arena, the lower arena, and at Railay Beach
    const sceneModel: SceneModel = new SceneModel(
        'Scene1',
        upperArenaLongitudeLatitudeHeight,
        <group>
            <CoordinatedGroup longitudeLatitudeHeight={upperArenaLongitudeLatitudeHeight}>
                <Box position={[0, 0, 0]}/>
            </CoordinatedGroup>
            <CoordinatedGroup longitudeLatitudeHeight={barnParkingLotLongitudeLatitudeHeight}>
                <Box position={[0, 0, 0]}/>
            </CoordinatedGroup>
            <CoordinatedGroup longitudeLatitudeHeight={lowerArenaLongitudeLatitudeHeight}>
                <Box position={[0, 0, 0]}/>
            </CoordinatedGroup>
        </group>
    )

    const sceneViewModel: SceneViewModel = new SceneViewModel(
        'SceneView1',
        sceneModel
    )

    return (
        <>
            <SceneButton
                onClick={() => sceneViewModel.moveCameraToLongitudeLatitudeHeight(upperArenaLongitudeLatitudeHeight)}>
                Upper Arena
            </SceneButton>
            <SceneButton
                onClick={() => sceneViewModel.moveCameraToLongitudeLatitudeHeight(barnParkingLotLongitudeLatitudeHeight)}>
                Parking
            </SceneButton>
            <SceneButton
                onClick={() => sceneViewModel.moveCameraToLongitudeLatitudeHeight(lowerArenaLongitudeLatitudeHeight)}>
                Lower Arena
            </SceneButton>
            <SceneView data-testid="SceneView-id" tabIndex={0} sceneViewModel={sceneViewModel}/>
        </>
    )
}
CoordinatedGroups.args = {};

export const GoogleTiles: Story = (args: any) => {

    // coordinates
    const bobbyDoddStadiumLongitudeLatitudeHeight = new Vector3(-84.39285552774608, 33.772504710962814, 250.0)

    // create a scene with boxes in the upper arena, the lower arena, and at Railay Beach
    const sceneModel: SceneModel = new SceneModel(
        'Scene1',
        bobbyDoddStadiumLongitudeLatitudeHeight,
        <Box position={[0, 0, 0]}/>,
        <GoogleMapsPhotorealistic3DTiles/>
    )

    const sceneViewModel: SceneViewModel = new SceneViewModel(
        'SceneView1',
        sceneModel
    )

    return (
        <SceneView data-testid="SceneView-id" tabIndex={0} sceneViewModel={sceneViewModel}/>
    )
}
GoogleTiles.args = {};


export const Everything: Story = (args: any) => {

    // coordinates
    const upperArenaLongitudeLatitudeHeight = new Vector3(-83.765350, 34.401279, 357.0)
    const barnParkingLotLongitudeLatitudeHeight = new Vector3(-83.76536188233062, 34.400715493095205, 353.0)
    const lowerArenaLongitudeLatitudeHeight = new Vector3(-83.76612684589652, 34.40024525982904, 350.0)

    // create a scene with multiple types of 3D elements in the farm's upper arena
    const sceneModel: SceneModel = new SceneModel(
        'Scene1',
        upperArenaLongitudeLatitudeHeight,
        <group>
            <CoordinatedGroup longitudeLatitudeHeight={upperArenaLongitudeLatitudeHeight}>
                <PointCloud
                    baseUrl="https://raw.githubusercontent.com/potree/potree/develop/pointclouds/lion_takanawa/"
                    fileName="cloud.js"
                    onPointCloudLoad={rotatePointCloudOctreeYUp}
                    position={[0, -.75, 0]}
                />
            </CoordinatedGroup>
            <CoordinatedGroup longitudeLatitudeHeight={barnParkingLotLongitudeLatitudeHeight}>
                <Box position={[0, 0, 0]}/>
            </CoordinatedGroup>
            <CoordinatedGroup longitudeLatitudeHeight={lowerArenaLongitudeLatitudeHeight}>
                <GaussianSplatCloud baseUrl="./"
                                    fileName="splats/ornament/ornament.splat"
                                    position={[0, 1, 0]}
                                    rotation={[
                                        MathUtils.degToRad(-30),
                                        MathUtils.degToRad(-45),
                                        MathUtils.degToRad(180), 'ZYX']}
                />
            </CoordinatedGroup>
        </group>
    )

    const sceneViewModel: SceneViewModel = new SceneViewModel(
        'SceneView1',
        sceneModel
    )

    return (
        <>
            <SceneButton
                onClick={() => sceneViewModel.moveCameraToLongitudeLatitudeHeight(upperArenaLongitudeLatitudeHeight)}>
                Upper Arena
            </SceneButton>
            <SceneButton
                onClick={() => sceneViewModel.moveCameraToLongitudeLatitudeHeight(barnParkingLotLongitudeLatitudeHeight)}>
                Parking
            </SceneButton>
            <SceneButton
                onClick={() => sceneViewModel.moveCameraToLongitudeLatitudeHeight(lowerArenaLongitudeLatitudeHeight)}>
                Lower Arena
            </SceneButton>
            <SceneView data-testid="SceneView-id" sceneViewModel={sceneViewModel}/>
        </>
    )
}
Everything.args = {};
