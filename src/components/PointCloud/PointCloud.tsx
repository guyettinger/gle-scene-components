import { useFrame } from "@react-three/fiber";
import { PointCloudOctree, Potree } from "gle-three-loader";
import { useRef, useState } from "react";
import { Group, Vector3 } from "three";

// Manages the necessary state for loading/updating one or more point clouds.
const potree = new Potree();
// Show at most 2 million points.
potree.pointBudget = 2_000_000;
// List of point clouds which we loaded and need to update.
const pointClouds: PointCloudOctree[] = [];

export interface PointCloudProps {
    fileName:string
    baseUrl:string
    position: Vector3
}

export const PointCloud = ({fileName, baseUrl, position}:PointCloudProps) => {

    const [pointCloudInitialized, setPointCloudInitialized] = useState<boolean>(false)
    const [pointCloudLoading, setPointCloudLoading] = useState<boolean>(false)
    const pointCloudGroupReference = useRef<Group>(null)

    useFrame(({gl, scene, camera}) => {

        // wait for point cloud group
        const pointCloudGroup = pointCloudGroupReference?.current;
        if(!pointCloudGroup) return;

        // initialize point cloud
        if(!pointCloudInitialized){

            // wait for point cloud load
            if(pointCloudLoading) return;
            setPointCloudLoading(true)
            console.log('point cloud loading')

            // load point cloud
            potree
                .loadPointCloud(
                    // The name of the point cloud which is to be loaded.
                    fileName,
                    // Given the relative URL of a file, should return a full URL (e.g. signed).
                    relativeUrl => `${baseUrl}${relativeUrl}`,
                )
                .then(pco => {
                    pointClouds.push(pco)

                    // Add the loaded point cloud to your ThreeJS scene.
                    pointCloudGroup.add(pco)

                    // Make the point cloud show up at the center of the screen
                    pco.translateX(-1)
                    pco.translateY(1)
                    pco.rotateX(-Math.PI / 2)
                    pco.material.size = 1.0;

                    console.log("point cloud loaded")

                    // finished initialization
                    setPointCloudInitialized(true)
                });

        }

        // render point cloud
        potree.updatePointClouds(pointClouds, camera, gl);
    }, 2)
    return (
        <group position={position} ref={pointCloudGroupReference}>
        </group>
    )
}