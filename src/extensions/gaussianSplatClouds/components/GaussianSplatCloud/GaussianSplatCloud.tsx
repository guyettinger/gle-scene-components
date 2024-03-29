import { useRef, useState } from "react";
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
        position,
        rotation,
        scale,
        ...groupProps
    }: GaussianSplatCloudProps) => {
    const sceneViewModel = useSceneViewModel()
    const gaussianSplatCloudsSceneViewExtension = sceneViewModel.getSceneViewExtension<GaussianSplatCloudsSceneViewForegroundLayerExtension>(SceneExtensionNames.GaussianSplatClouds)
    const [gaussianSplatCloudLoading, setGaussianSplatCloudLoading] = useState<boolean>(false)
    const [gaussianSplatCloudLoaded, setGaussianSplatCloudLoaded] = useState<boolean>(false)
    const gaussianSplatCloudGroupReference = useRef<Group>(null)

    useFrame(({gl, scene, camera, pointer, size}) => {
        let gaussianSplatViewer = gaussianSplatCloudsSceneViewExtension.gaussianSplatViewer
        if (!gaussianSplatViewer) {
            // initialize gaussian splat viewer
            gaussianSplatViewer = new GaussianSplatViewer({
                renderer: gl,
                camera: camera,
                scene: scene,
                selfDrivenMode: false,
                useBuiltInControls: false,
                ignoreDevicePixelRatio: false,
                sharedMemoryForWorkers: false,
                gpuAcceleratedSort: false
            })
            gaussianSplatCloudsSceneViewExtension.gaussianSplatViewer = gaussianSplatViewer
        } else {
            if (!gaussianSplatCloudLoaded && !gaussianSplatCloudLoading) {
                // load gaussian splat cloud
                setGaussianSplatCloudLoading(true)

                gaussianSplatViewer.loadFile(baseUrl + fileName, {
                    halfPrecisionCovariancesOnGPU: true,
                    splatAlphaRemovalThreshold: 5, // out of 255
                    showLoadingSpinner: false,
                    position: position,
                    rotation: rotation,
                    scale: scale
                }).then(() => {
                    const group = gaussianSplatCloudGroupReference.current;
                    const splatMesh = gaussianSplatViewer?.getSplatMesh()
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
                                const outHits: any[] | undefined = gaussianSplatViewer?.performRaycast(camera, mousePosition)
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
                }).then(() => {
                    // finished loading
                    setGaussianSplatCloudLoaded(true)
                    setGaussianSplatCloudLoading(false)

                    // gaussian splat viewer initialized
                    gaussianSplatCloudsSceneViewExtension.gaussianSplatViewerInitialized = true;

                    // let loading complete and invalidate the scene
                    setTimeout(() => {
                        sceneViewModel.invalidate()
                    }, 100)
                })
            }
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