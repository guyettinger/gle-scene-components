import { useId, useRef, useState } from "react";
import { Group, Vector2 } from "three";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Viewer as GaussianSplatViewer } from "gle-gaussian-splat-3d";
import { SceneExtensionNames } from "../../../sceneExtensionNames";
import { useSceneViewModel } from "../../../../providers";
import {
    GaussianSplatCloudsSceneViewForegroundLayerExtension
} from "../../gaussianSplatCloudsSceneViewForegroundLayerExtension";
import { GaussianSplatCloudProps } from "./GaussianSplatCloud.types";

export const GaussianSplatCloud = (
    {
        fileName,
        baseUrl,
        onSplatMeshLoad,
        ...groupProps
    }: GaussianSplatCloudProps) => {
    const id = useId()
    const sceneViewModel = useSceneViewModel()
    const gaussianSplatCloudsSceneViewExtension = sceneViewModel.getSceneViewExtension<GaussianSplatCloudsSceneViewForegroundLayerExtension>(SceneExtensionNames.GaussianSplatClouds)
    const [gaussianSplatCloudLoading, setGaussianSplatCloudLoading] = useState<boolean>(false)
    const [gaussianSplatCloudLoaded, setGaussianSplatCloudLoaded] = useState<boolean>(false)
    const gaussianSplatCloudGroupReference = useRef<Group>(null)

    useFrame(({gl, scene, camera, pointer, size}) => {

        // if the cloud hasn't loaded and is not loading
        if (!gaussianSplatCloudLoaded && !gaussianSplatCloudLoading) {

            // load gaussian splat cloud
            setGaussianSplatCloudLoading(true)

            // create a gaussian splat viewer
            let gaussianSplatViewer = new GaussianSplatViewer({
                renderer: gl,
                camera: camera,
                scene: scene,
                selfDrivenMode: false,
                useBuiltInControls: false,
                ignoreDevicePixelRatio: false
            })

            // load the file
            gaussianSplatViewer.loadFile(baseUrl + fileName, {
                halfPrecisionCovariancesOnGPU: true,
                splatAlphaRemovalThreshold: 5, // out of 255
            }).then(() => {
                const group = gaussianSplatCloudGroupReference.current;
                const splatMesh = gaussianSplatViewer.getSplatMesh()
                if (splatMesh) {

                    // add the splat mesh to the group
                    if (group) {
                        group.add(splatMesh)

                        // use viewer raycaster
                        group.raycast = (raycaster, intersects) => {

                            // convert pointer to screen coordinates
                            let x = ((pointer.x + 1) / 2) * size.width
                            let y = size.height - ((pointer.y + 1) / 2) * size.height
                            const mousePosition = new Vector2(x, y)

                            // perform raycast
                            const outHits: any[] = gaussianSplatViewer.performRaycast(camera, mousePosition)
                            outHits?.forEach((hit) => {
                                intersects.push({
                                    distance: hit.distance,
                                    point: hit.origin,
                                    normal: hit.normal,
                                    object: splatMesh
                                })
                            })
                        }
                    }

                    // notify splat mesh load
                    onSplatMeshLoad?.(splatMesh)
                }
                console.log('Loading gaussian splat cloud success')
            }).catch((reason: any) => {
                console.log('Loading gaussian splat cloud failed', reason)
            }).finally(() => {
                // finished loading
                setGaussianSplatCloudLoaded(true)
                setGaussianSplatCloudLoading(false)

                // register the gaussian splat viewer
                gaussianSplatCloudsSceneViewExtension.gaussianSplatViewerMap.set(id, gaussianSplatViewer)

                // let loading complete and invalidate the scene
                setTimeout(() => {
                    sceneViewModel.invalidate()
                }, 100)
            })
        }
    }, 1)

    const handleDoubleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        gaussianSplatCloudsSceneViewExtension.performDoubleClick(e)
    }

    return (
        <group {...groupProps} ref={gaussianSplatCloudGroupReference} onDoubleClick={handleDoubleClick}>
        </group>
    )
}