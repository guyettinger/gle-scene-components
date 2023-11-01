import { useFrame, useThree } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { useRef } from "react";
import { useSceneModel, useSceneViewModel } from "../../providers";

export const ThreeScene = () => {
    const sceneViewModel = useSceneViewModel()
    const {threeScene} = useSceneModel()
    const threeCameraControlsReference = useRef<CameraControls>(null)
    const debug = sceneViewModel.debug

    useThree((threeRootState) => {
        sceneViewModel.threeRootState = threeRootState
        sceneViewModel.cameraControls = threeCameraControlsReference.current
    })

    // render loop
    useFrame((rootState, delta) => {
        sceneViewModel.render(rootState, delta)
    }, 1)

    const handleCameraControlsChange = () => {
        sceneViewModel.syncCameras();
    }

    return (
        <scene>
            <ambientLight></ambientLight>
            <CameraControls
                ref={threeCameraControlsReference}
                smoothTime={0}
                draggingSmoothTime={0}
                onChange={handleCameraControlsChange}
            />
            <group>
                {threeScene}
                {debug && <axesHelper args={[5]}/>}
            </group>
        </scene>
    )
}