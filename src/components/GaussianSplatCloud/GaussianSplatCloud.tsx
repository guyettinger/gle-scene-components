import { useRef, useState } from "react";
import { Group, MathUtils} from "three";
import { useFrame } from "@react-three/fiber";
import { useSceneViewModel } from "../../providers";
import { GaussianSplatCloudProps } from "./GaussianSplatCloud.types";
import { Viewer as GaussianSplatViewer } from "gle-gs3d"

export const GaussianSplatCloud = ({fileName, baseUrl, position}: GaussianSplatCloudProps) => {
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
            if(!gaussianSplatCloudLoaded && !gaussianSplatCloudLoading){
                // load gaussian splat cloud
                setGaussianSplatCloudLoading(true)

                gaussianSplatViewer.loadFile(baseUrl + fileName, {
                    halfPrecisionCovariancesOnGPU: true
                }).then(() => {
                    const group = gaussianSplatCloudGroupReference.current;
                    const splatMesh = gaussianSplatViewer.splatMesh
                    if(group && splatMesh){
                        group.add(splatMesh)
                        group.rotateZ(MathUtils.degToRad(180))
                        group.rotateX(MathUtils.degToRad(-30))
                        group.translateY(-4)
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
        <group position={position} ref={gaussianSplatCloudGroupReference}>
        </group>
    )
}