import { useFrame, useThree } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { useRef } from "react";
import { useSceneModel, useSceneViewModel } from "../../providers";
import { SceneViewSceneProps } from "./SceneView.types";

export const SceneViewScene = ({...sceneProps}:SceneViewSceneProps) => {
    const sceneViewModel = useSceneViewModel()
    const {threeScene} = useSceneModel()
    const cameraControlsReference = useRef<CameraControls>(null)
    const debug = sceneViewModel.debug

    useThree((threeRootState) => {
        sceneViewModel.sceneRootState = threeRootState
        sceneViewModel.cameraControls = cameraControlsReference.current
        sceneViewModel.raycaster = threeRootState.raycaster
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
            <group>
                {threeScene}
                {debug && <axesHelper args={[5]}/>}
            </group>
        </scene>
    )
}