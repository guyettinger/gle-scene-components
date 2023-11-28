import { Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { CameraControls, PerspectiveCamera } from "@react-three/drei";
import { useRef, useState } from "react";
import { useSceneViewModel } from "../../../../providers";
import { ThreeSceneProps } from "./ThreeView.types";

export const ThreeScene = ({children, cameraPosition, castShadow, receiveShadow, ...sceneProps}: ThreeSceneProps) => {
    const sceneViewModel = useSceneViewModel()
    const cameraControlsReference = useRef<CameraControls>(null)
    const [initialCameraPosition] = useState(cameraPosition ?? new Vector3(0, 5, 10))

    // todo: choose a reasonable position for the sun within camera range
    const sunPosition = sceneViewModel.getSceneDirectionForSun().multiplyScalar(100)

    useThree((threeRootState) => {
        sceneViewModel.sceneRootState = threeRootState
        sceneViewModel.cameraControls = cameraControlsReference.current
    })

    // render loop
    useFrame((rootState, delta) => {
        sceneViewModel.render(rootState, delta)
    }, 1)

    const handleCameraControlsChange = () => {
        sceneViewModel.syncCameras();
    }

    const handlePointerMissed = (e: MouseEvent) => {
        // mouse event did not hit any scene objects, pass to scene view
        sceneViewModel.passMouseEvent(e)
    }

    return (
        <scene onPointerMissed={handlePointerMissed}
               castShadow={castShadow}
               receiveShadow={receiveShadow}
               {...sceneProps}>
            <ambientLight/>
            <directionalLight position={sunPosition}
                              color={0xfff1e0}
                              intensity={1.5}
                              castShadow={castShadow}>
                {castShadow && <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]}/>}
            </directionalLight>
            <CameraControls
                ref={cameraControlsReference}
                makeDefault={true}
                smoothTime={0}
                draggingSmoothTime={0}
                onChange={handleCameraControlsChange}
            >
                <PerspectiveCamera
                    position={initialCameraPosition}
                    makeDefault={true}
                />
            </CameraControls>
            {children}
        </scene>
    )
}