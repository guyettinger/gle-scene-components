import { Meta, StoryObj } from "@storybook/react";
import { useRef } from "react";
import { MathUtils, Vector3 } from "three";
import styled from "styled-components";
import { Scene } from "./Scene";
import { SceneInterface } from "./Scene.types";
import { SceneContent } from "../SceneContent";
import { CoordinatedGroup } from "../CoordinatedGroup";
import {
    Box,
    CesiumSceneContent, Floor,
    GaussianSplatCloud,
    GoogleMapsPhotorealistic3DTiles,
    OGC3DTiles,
    PointCloud,
    rotatePointCloudOctreeYUp,
    ThreeSceneContent
} from "../../extensions";

const meta: Meta<typeof Scene> = {
    component: Scene,
    title: "gle-scene-components/Scene",
    argTypes: {},
};
export default meta;

type Story = StoryObj<typeof Scene>;

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

    return (
        <Scene data-testid='Scene-id'
               name='Scene1'
               sceneCenterLongitudeLatitudeHeight={[-83.765350, 34.401279, 357.0]}>
            <SceneContent>
                <ThreeSceneContent>
                    <Box position={[4, 0, 0]}/>
                    <Box position={[0, 0, -4]}/>
                    <Box position={[-4, 0, 0]}/>
                    <Floor position={[0, -0.5, 0]}/>
                </ThreeSceneContent>
            </SceneContent>
        </Scene>
    )
}
Boxes.args = {};


export const AnimatedBoxes: Story = (args: any) => {
    return (
        <Scene data-testid='Scene-id'
               name='Scene1'
               sceneCenterLongitudeLatitudeHeight={[-83.765350, 34.401279, 357.0]}>
            <SceneContent>
                <ThreeSceneContent>
                    <Box position={[4, 0, 0]} animate={true}/>
                    <Box position={[0, 0, -4]} animate={true}/>
                    <Box position={[-4, 0, 0]} animate={true}/>
                </ThreeSceneContent>
            </SceneContent>
        </Scene>
    )
}
AnimatedBoxes.args = {};

export const PointClouds: Story = (args: any) => {
    return (
        <Scene data-testid='Scene-id'
               name='Scene1'
               sceneCenterLongitudeLatitudeHeight={[-83.765350, 34.401279, 357.0]}>
            <SceneContent>
                <ThreeSceneContent>
                    <PointCloud
                        baseUrl="https://raw.githubusercontent.com/potree/potree/develop/pointclouds/lion_takanawa/"
                        fileName="cloud.js"
                        onPointCloudLoad={rotatePointCloudOctreeYUp}
                        position={[0, -.75, 0]}
                    />
                </ThreeSceneContent>
            </SceneContent>
        </Scene>
    )
}
PointClouds.args = {};

export const GaussianSplatClouds: Story = (args: any) => {
    return (
        <Scene data-testid='Scene-id'
               name='Scene1'
               sceneCenterLongitudeLatitudeHeight={[-83.765350, 34.401279, 357.0]}>
            <SceneContent>
                <ThreeSceneContent>
                    <GaussianSplatCloud baseUrl="./"
                                        fileName="splats/ornament/ornament.splat"
                                        position={[0, 2, 0]}
                                        rotation={[
                                            MathUtils.degToRad(-30),
                                            MathUtils.degToRad(-45),
                                            MathUtils.degToRad(180), 'ZYX'
                                        ]}
                    />
                </ThreeSceneContent>
            </SceneContent>
        </Scene>
    )
}
GaussianSplatClouds.args = {};


export const CoordinatedGroups: Story = (args: any) => {

    // coordinates
    const upperArenaLongitudeLatitudeHeight = new Vector3(-83.765350, 34.401279, 357.0)
    const barnParkingLotLongitudeLatitudeHeight = new Vector3(-83.76536188233062, 34.400715493095205, 353.0)
    const lowerArenaLongitudeLatitudeHeight = new Vector3(-83.76612684589652, 34.40024525982904, 350.0)

    // reference
    const sceneRef = useRef<SceneInterface>(null)

    return (
        <>
            <SceneButton
                onClick={() => sceneRef.current?.moveCameraToLongitudeLatitudeHeight(upperArenaLongitudeLatitudeHeight)}>
                Upper Arena
            </SceneButton>
            <SceneButton
                onClick={() => sceneRef.current?.moveCameraToLongitudeLatitudeHeight(barnParkingLotLongitudeLatitudeHeight)}>
                Parking
            </SceneButton>
            <SceneButton
                onClick={() => sceneRef.current?.moveCameraToLongitudeLatitudeHeight(lowerArenaLongitudeLatitudeHeight)}>
                Lower Arena
            </SceneButton>
            <Scene data-testid='Scene-id'
                   ref={sceneRef}
                   name='Scene1'
                   sceneCenterLongitudeLatitudeHeight={upperArenaLongitudeLatitudeHeight}>
                <SceneContent>
                    <ThreeSceneContent>
                        <CoordinatedGroup longitudeLatitudeHeight={upperArenaLongitudeLatitudeHeight}>
                            <Box position={[0, 0, 0]}/>
                        </CoordinatedGroup>
                        <CoordinatedGroup longitudeLatitudeHeight={barnParkingLotLongitudeLatitudeHeight}>
                            <Box position={[0, 0, 0]}/>
                        </CoordinatedGroup>
                        <CoordinatedGroup longitudeLatitudeHeight={lowerArenaLongitudeLatitudeHeight}>
                            <Box position={[0, 0, 0]}/>
                        </CoordinatedGroup>
                    </ThreeSceneContent>
                </SceneContent>
            </Scene>
        </>
    )
}
CoordinatedGroups.args = {};

export const GoogleTiles: Story = (args: any) => {
    return (
        <Scene data-testid='Scene-id'
               name='Scene1'
               sceneCenterLongitudeLatitudeHeight={[-84.39285552774608, 33.772504710962814, 250.0]}>
            <SceneContent>
                <ThreeSceneContent>
                    <Box position={[0, 0, 0]}/>,
                </ThreeSceneContent>
                <CesiumSceneContent>
                    <GoogleMapsPhotorealistic3DTiles/>
                </CesiumSceneContent>
            </SceneContent>
        </Scene>
    )
}
GoogleTiles.args = {};

export const ThreeDTiles: Story = (args: any) => {
    return (
        <Scene data-testid='Scene-id'
               name='Scene1'
               sceneCenterLongitudeLatitudeHeight={[-83.76612684589652, 34.40024525982904, 349.0]}>
            <SceneContent>
                <ThreeSceneContent>
                    <OGC3DTiles url={"https://storage.googleapis.com/ogc-3d-tiles/museumMeshed/tileset.json"}
                                position={[0, -2, 0]}
                                rotation={[
                                    MathUtils.degToRad(0),
                                    MathUtils.degToRad(90),
                                    MathUtils.degToRad(180), 'XYZ'
                                ]}
                    />
                </ThreeSceneContent>
            </SceneContent>
        </Scene>
    )
}
ThreeDTiles.args = {};


export const Everything: Story = (args: any) => {

    // coordinates
    const upperArenaLongitudeLatitudeHeight = new Vector3(-83.765350, 34.401279, 357.0)
    const barnParkingLotLongitudeLatitudeHeight = new Vector3(-83.76536188233062, 34.400715493095205, 353.0)
    const lowerArenaLongitudeLatitudeHeight = new Vector3(-83.76612684589652, 34.40024525982904, 350.0)

    // reference
    const sceneRef = useRef<SceneInterface>(null)

    return (
        <>
            <SceneButton
                onClick={() => sceneRef.current?.moveCameraToLongitudeLatitudeHeight(upperArenaLongitudeLatitudeHeight)}>
                Upper Arena
            </SceneButton>
            <SceneButton
                onClick={() => sceneRef.current?.moveCameraToLongitudeLatitudeHeight(barnParkingLotLongitudeLatitudeHeight)}>
                Parking
            </SceneButton>
            <SceneButton
                onClick={() => sceneRef.current?.moveCameraToLongitudeLatitudeHeight(lowerArenaLongitudeLatitudeHeight)}>
                Lower Arena
            </SceneButton>
            <Scene data-testid='Scene-id'
                   ref={sceneRef}
                   name='Scene1'
                   sceneCenterLongitudeLatitudeHeight={upperArenaLongitudeLatitudeHeight}>
                <SceneContent>
                    <ThreeSceneContent>
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
                            <group position={[0, 2.60, -15]}
                                   rotation={[MathUtils.degToRad(30), 0, 0, 'XYZ']}>
                                <GaussianSplatCloud baseUrl="./"
                                                    fileName="splats/ornament/ornament.splat"
                                                    rotation={[
                                                        MathUtils.degToRad(-38),
                                                        MathUtils.degToRad(-85),
                                                        MathUtils.degToRad(180), 'ZYX']}
                                />
                            </group>
                            <OGC3DTiles url={"https://storage.googleapis.com/ogc-3d-tiles/museumMeshed/tileset.json"}
                                        position={[0, -2, 0]}
                                        rotation={[
                                            MathUtils.degToRad(0),
                                            MathUtils.degToRad(90),
                                            MathUtils.degToRad(180), 'XYZ'
                                        ]}/>
                        </CoordinatedGroup>
                    </ThreeSceneContent>
                    <CesiumSceneContent>
                        <GoogleMapsPhotorealistic3DTiles/>
                    </CesiumSceneContent>
                </SceneContent>
            </Scene>
        </>
    )
}
Everything.args = {};
