import { useEffect, useRef } from "react";
import { Group } from "three";
import { ThreeEvent } from "@react-three/fiber";
import { PointCloudProps } from "./PointCloud.types";
import { useSceneViewModel } from "../../providers";
import { PointCloudsSceneViewExtension } from "../../extensions";

export const PointCloud = ({fileName, baseUrl, onPointCloudLoad, ...groupProps}: PointCloudProps) => {
    const sceneViewModel = useSceneViewModel()
    const pointCloudGroupReference = useRef<Group>(null)
    const pointCloudsSceneViewExtension = sceneViewModel.sceneViewExtensions.get('pointClouds') as PointCloudsSceneViewExtension
    const pointCloudsSceneExtension = pointCloudsSceneViewExtension.pointCloudsSceneExtension

    useEffect(() => {

        // ensure point cloud group
        const pointCloudGroup = pointCloudGroupReference?.current;
        if (!pointCloudGroup) return

        console.log('point cloud loading')

        // load point cloud
        pointCloudsSceneExtension.potree
            .loadPointCloud(
                fileName,
                relativeUrl => `${baseUrl}${relativeUrl}`,
            )
            .then(pco => {

                // register the point cloud
                pointCloudsSceneExtension.pointClouds.push(pco)

                // add the point cloud to the group
                pointCloudGroup.add(pco)

                // notify point cloud loaded
                onPointCloudLoad?.(pco)

            })
            .finally(() => {
                console.log("point cloud loaded")
            })
    }, [fileName, baseUrl]);

    const handleDoubleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        pointCloudsSceneViewExtension.performDoubleClick(e)
    }

    return (
        <group {...groupProps}
               ref={pointCloudGroupReference}
               onDoubleClick={handleDoubleClick}>
        </group>
    )
}