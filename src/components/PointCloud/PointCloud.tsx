import { useEffect, useRef, useState } from "react";
import { Group } from "three";
import { useSceneViewModel } from "../../providers";
import { PointCloudProps } from "./PointCloud.types";
import { ThreeEvent } from "@react-three/fiber";

export const PointCloud = ({fileName, baseUrl, onPointCloudLoad, ...groupProps}: PointCloudProps) => {
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
                fileName,
                relativeUrl => `${baseUrl}${relativeUrl}`,
            )
            .then(pco => {

                // add the point cloud to the scene model
                sceneModel.pointClouds.push(pco)

                // add the point cloud to the group
                pointCloudGroup.add(pco)

                // notify point cloud loaded
                onPointCloudLoad?.(pco)

            })
            .finally(() => {
                console.log("point cloud loaded")

                // finished loading
                setPointCloudLoading(false)
            });
    }, [fileName, baseUrl]);

    const handlePointerDown = (e:any) => {
        // Only the mesh closest to the camera will be processed
        e.stopPropagation()
        // You may optionally capture the target
        e.target.setPointerCapture(e.pointerId)
    }

    const handleDoubleClick = (e:ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        sceneViewModel.performDoubleClickOnPointCloud(e)
    }

    return (
        <group {...groupProps}
               ref={pointCloudGroupReference}
               onDoubleClick={handleDoubleClick}>
        </group>
    )
}