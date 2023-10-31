import { Meta, StoryObj } from "@storybook/react";
import { KeyboardEvent } from "react";
import { Euler, MathUtils, Vector3 } from "three";
import { PointCloudOctree } from "gle-potree";
import { SceneModel, SceneViewModel } from "../../models";
import { SceneView } from "./SceneView";
import { Box } from "../Box";
import { PointCloud } from "../PointCloud";
import { GaussianSplatCloud } from "../GaussianSplatCloud";
import { CoordinatedGroup } from "../CoordinatedGroup";

const meta: Meta<typeof SceneView> = {
    component: SceneView,
    title: "gle-scene-components/SceneView",
    argTypes: {},
};
export default meta;

type Story = StoryObj<typeof SceneView>;

export const Boxes: Story = (args: any) => {
    const farmGeodeticCenter = new Vector3(-83.765350, 34.401279, 357.0)

    const sceneModel: SceneModel = new SceneModel(
        'Scene1',
        <group>
            <Box position={[4, 0, 0]}/>
            <Box position={[0, 0, -4]}/>
            <Box position={[-4, 0, 0]}/>
        </group>,
        farmGeodeticCenter
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
    const farmGeodeticCenter = new Vector3(-83.765350, 34.401279, 357.0)

    const handlePointCloud1Load = (pco: PointCloudOctree) => {
        // translate the point cloud
        pco.translateX(pco.pcoGeometry.offset.x)
        pco.translateY(-pco.pcoGeometry.offset.y)

        // rotate the point cloud
        pco.rotateX(-Math.PI / 2)
    }

    const handlePointCloud2Load = (pco: PointCloudOctree) => {
        // translate the point cloud
        pco.translateX(pco.pcoGeometry.offset.x)
        pco.translateY(-pco.pcoGeometry.offset.y)

        // rotate the point cloud
        pco.rotateX(-Math.PI / 2)
    }

    const sceneModel: SceneModel = new SceneModel(
        'Scene1',
        <group>
            <PointCloud
                baseUrl="https://raw.githubusercontent.com/potree/potree/develop/pointclouds/lion_takanawa/"
                fileName="cloud.js"
                onPointCloudLoad={handlePointCloud1Load}
                position={[0, -.75, 0]}
            />
            <PointCloud
                baseUrl="https://raw.githubusercontent.com/potree/potree/develop/pointclouds/lion_takanawa/"
                fileName="cloud.js"
                onPointCloudLoad={handlePointCloud2Load}
                position={[10, -.75, 0]}
            />
        </group>,
        farmGeodeticCenter
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
    const farmGeodeticCenter = new Vector3(-83.765350, 34.401279, 357.0)

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

    const sceneModel: SceneModel = new SceneModel(
        'Scene1',
        <group>
            <GaussianSplatCloud baseUrl="./"
                                fileName="splats/garden/garden_high.splat"
                                position={position}
                                rotation={rotation}/>
        </group>,
        farmGeodeticCenter
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
    const farmGeodeticCenter = new Vector3(-83.765350, 34.401279, 357.0)

    const handlePointCloud1Load = (pco: PointCloudOctree) => {
        // translate the point cloud
        pco.translateX(pco.pcoGeometry.offset.x)
        pco.translateY(-pco.pcoGeometry.offset.y)

        // rotate the point cloud
        pco.rotateX(-Math.PI / 2)
    }

    const handlePointCloud2Load = (pco: PointCloudOctree) => {
        // translate the point cloud
        pco.translateX(pco.pcoGeometry.offset.x)
        pco.translateY(-pco.pcoGeometry.offset.y)

        // rotate the point cloud
        pco.rotateX(-Math.PI / 2)
    }

    const sceneModel: SceneModel = new SceneModel(
        'Scene1',
        <group>
            <Box position={[4, 0, 0]}/>
            <Box position={[0, 0, -4]}/>
            <Box position={[-4, 0, 0]}/>
            <PointCloud
                baseUrl="https://raw.githubusercontent.com/potree/potree/develop/pointclouds/lion_takanawa/"
                fileName="cloud.js"
                onPointCloudLoad={handlePointCloud1Load}
                position={[0, -.75, 0]}
            />
            <PointCloud
                baseUrl="https://raw.githubusercontent.com/potree/potree/develop/pointclouds/lion_takanawa/"
                fileName="cloud.js"
                onPointCloudLoad={handlePointCloud2Load}
                position={[10, -.75, 0]}
            />
        </group>,
        farmGeodeticCenter
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
    const farmGeodeticCenter = new Vector3(-83.765350, 34.401279, 357.0)
    const lowerArenaGeodeticCenter = new Vector3(-83.76612684589652, 34.40024525982904, 350.0)
    const beachGeodeticCenter = new Vector3(-80.17731456319245, 25.710195530113904, 10)

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        console.log('key down', e)
        e.stopPropagation()
        e.preventDefault()
    }

    const sceneModel: SceneModel = new SceneModel(
        'Scene1',
        <group>
            <CoordinatedGroup coordinates={farmGeodeticCenter}>
                <Box position={[0, 0, 0]}/>
                <Box position={[4, 0, 0]}/>
                <Box position={[0, 0, -4]}/>
                <Box position={[-4, 0, 0]}/>
                <Box position={[0, 4, 0]}/>
            </CoordinatedGroup>
            <CoordinatedGroup coordinates={lowerArenaGeodeticCenter}>
                <Box position={[0, 0, 0]}/>
                <Box position={[4, 0, 0]}/>
                <Box position={[0, 0, -4]}/>
                <Box position={[-4, 0, 0]}/>
                <Box position={[0, 4, 0]}/>
            </CoordinatedGroup>
            <CoordinatedGroup coordinates={beachGeodeticCenter}>
                <Box position={[0, 0, 0]}/>
                <Box position={[4, 0, 0]}/>
                <Box position={[0, 0, -4]}/>
                <Box position={[-4, 0, 0]}/>
                <Box position={[0, 4, 0]}/>
            </CoordinatedGroup>
        </group>,
        farmGeodeticCenter
    )

    const sceneViewModel: SceneViewModel = new SceneViewModel(
        'SceneView1',
        sceneModel
    )

    return (
        <SceneView data-testid="SceneView-id" tabIndex={0} sceneViewModel={sceneViewModel} onKeyDown={handleKeyDown}/>
    )
}
CoordinatedGroups.args = {};