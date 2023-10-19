import { useEffect, useRef, useState } from "react";
import { Group } from "three";
import { useSceneViewModel } from "../../providers";
import { PointCloudProps } from "./PointCloud.types";

export const PointCloud = ({fileName, baseUrl, position}: PointCloudProps) => {
    const sceneViewModel = useSceneViewModel()
    const sceneModel = sceneViewModel.sceneModel
    const [pointCloudLoading, setPointCloudLoading] = useState<boolean>(false)
    const pointCloudGroupReference = useRef<Group>(null)

    useEffect(() => {
        // wait for point cloud group
        const pointCloudGroup = pointCloudGroupReference?.current;
        if (!pointCloudGroup) return;

        console.log('point cloud loading')
        setPointCloudLoading(true)

        // load point cloud
        sceneModel.potree
            .loadPointCloud(
                // The name of the point cloud which is to be loaded.
                fileName,
                // Given the relative URL of a file, should return a full URL (e.g. signed).
                relativeUrl => `${baseUrl}${relativeUrl}`,
            )
            .then(pco => {
                sceneModel.pointClouds.push(pco)

                // Add the loaded point cloud to your ThreeJS scene.
                pointCloudGroup.add(pco)

                // Make the point cloud y-up, bottom
                pco.translateX(pco.pcoGeometry.offset.x)
                pco.translateY(-pco.pcoGeometry.offset.y)
                pco.rotateX(-Math.PI / 2)
                pco.material.size = 1.0

            })
            .finally(() => {
                console.log("point cloud loaded")

                // finished loading
                setPointCloudLoading(false)
            });
    }, [fileName, baseUrl]);

    return (
        <group position={position} ref={pointCloudGroupReference}>
        </group>
    )
}