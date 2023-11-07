import { useRef, useState } from "react";
import { Group } from "three";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { Viewer as GaussianSplatViewer } from "gle-gaussian-splat-3d";
import { GaussianSplatCloudProps } from "./GaussianSplatCloud.types";
import { useSceneViewModel } from "../../providers";

export const GaussianSplatCloud = (
    {
        fileName,
        baseUrl,
        onSplatMeshLoad,
        ...groupProps
    }: GaussianSplatCloudProps) => {
    const sceneViewModel = useSceneViewModel()
    const gaussianSplatCloudsSceneViewModel = sceneViewModel.gaussianSplatCloudsSceneViewModel
    const [gaussianSplatCloudLoading, setGaussianSplatCloudLoading] = useState<boolean>(false)
    const [gaussianSplatCloudLoaded, setGaussianSplatCloudLoaded] = useState<boolean>(false)
    const gaussianSplatCloudGroupReference = useRef<Group>(null)

    useFrame(({gl, scene, camera}) => {
        const gaussianSplatViewer = sceneViewModel.gaussianSplatCloudsSceneViewModel.gaussianSplatViewer
        if (!gaussianSplatViewer) {
            // initialize gaussian splat viewer
            const gaussianSplatViewer = new GaussianSplatViewer({
                renderer: gl,
                camera: camera,
                scene: scene,
                selfDrivenMode: false,
                useBuiltInControls: false,
                ignoreDevicePixelRatio: false
            })
            gaussianSplatCloudsSceneViewModel.gaussianSplatViewer = gaussianSplatViewer
        } else {
            if (!gaussianSplatCloudLoaded && !gaussianSplatCloudLoading) {
                // load gaussian splat cloud
                setGaussianSplatCloudLoading(true)

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
                                const mousePosition = gaussianSplatViewer.getMousePosition()
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

                    // gaussian splat viewer initialized
                    gaussianSplatCloudsSceneViewModel.gaussianSplatViewerInitialized = true;

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
        gaussianSplatCloudsSceneViewModel.performDoubleClick(e)
    }

    return (
        <group {...groupProps} ref={gaussianSplatCloudGroupReference} onDoubleClick={handleDoubleClick}>
        </group>
    )
}