import { useRef, useState } from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";
import { Viewer as GaussianSplatViewer } from "gle-gs3d";
import { useSceneViewModel } from "../../providers";
import { GaussianSplatCloudProps } from "./GaussianSplatCloud.types";

export const GaussianSplatCloud = (
    {
        fileName,
        baseUrl,
        onSplatMeshLoad,
        ...groupProps
    }: GaussianSplatCloudProps) => {
    const sceneViewModel = useSceneViewModel()
    const [gaussianSplatCloudLoading, setGaussianSplatCloudLoading] = useState<boolean>(false)
    const [gaussianSplatCloudLoaded, setGaussianSplatCloudLoaded] = useState<boolean>(false)
    const gaussianSplatCloudGroupReference = useRef<Group>(null)

    useFrame(({gl, scene, camera}) => {
        const gaussianSplatViewer = sceneViewModel.gaussianSplatViewer
        if (!gaussianSplatViewer) {
            // initialize gaussian splat viewer
            const gaussianSplatViewer = new GaussianSplatViewer({
                renderer: gl,
                camera: camera,
                scene: scene,
                selfDrivenMode: false,
                useBuiltInControls: false
            })
            gaussianSplatViewer.init()
            sceneViewModel.gaussianSplatViewer = gaussianSplatViewer
        } else {
            if (!gaussianSplatCloudLoaded && !gaussianSplatCloudLoading) {
                // load gaussian splat cloud
                setGaussianSplatCloudLoading(true)

                gaussianSplatViewer.loadFile(baseUrl + fileName, {
                    halfPrecisionCovariancesOnGPU: true
                }).then(() => {
                    const group = gaussianSplatCloudGroupReference.current;
                    const splatMesh = gaussianSplatViewer.splatMesh
                    if (splatMesh) {

                        // add the splat mesh to the group
                        if (group) {
                            group.add(splatMesh)
                        }

                        // notify splat mesh load
                        onSplatMeshLoad?.(splatMesh)

                        // invalidate the scene
                        sceneViewModel.invalidate()
                    }
                    console.log('Loading gaussian splat cloud success')
                }).catch((reason) => {
                    console.log('Loading gaussian splat cloud failed', reason)
                }).finally(() => {
                    // finished loading
                    setGaussianSplatCloudLoaded(true)
                    setGaussianSplatCloudLoading(false)
                })
            }
        }

    }, 1)

    return (
        <group {...groupProps} ref={gaussianSplatCloudGroupReference}>
        </group>
    )
}