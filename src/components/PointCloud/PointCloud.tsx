import { useEffect, useRef, useState } from "react";
import { Group } from "three";
import { useSceneViewModel } from "../../providers";
import { PointCloudProps } from "./PointCloud.types";

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

    return (
        <group {...groupProps} ref={pointCloudGroupReference}>
        </group>
    )
}