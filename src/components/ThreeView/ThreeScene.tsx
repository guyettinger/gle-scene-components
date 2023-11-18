import { useFrame, useThree } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { useRef } from "react";
import { useSceneViewModel } from "../../providers";
import { ThreeSceneProps } from "./ThreeView.types";

export const ThreeScene = ({children, ...sceneProps}: ThreeSceneProps) => {
    const sceneViewModel = useSceneViewModel()
    const cameraControlsReference = useRef<CameraControls>(null)

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
        <scene onPointerMissed={handlePointerMissed} {...sceneProps}>
            <ambientLight></ambientLight>
            <CameraControls
                ref={cameraControlsReference}
                smoothTime={0}
                draggingSmoothTime={0}
                onChange={handleCameraControlsChange}
            />
            {children}
        </scene>
    )
}