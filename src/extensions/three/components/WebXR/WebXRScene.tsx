import { Vector3 } from "three";
import { useXR } from "@react-three/xr";
import { useFrame } from "@react-three/fiber";
import { useSceneViewModel } from "../../../../providers";
import { WebXRSceneProps } from "./WebXRScene.types";

export const WebXRScene = ({children}: WebXRSceneProps) => {
    const sceneViewModel = useSceneViewModel()

    const {
        // An array of connected `XRController`
        controllers,
        // Whether the XR device is presenting in an XR session
        isPresenting,
        // Whether hand tracking inputs are active
        isHandTracking,
        // A THREE.Group representing the XR viewer or player
        player,
        // The active `XRSession`
        session,
        // `XRSession` foveation. This can be configured as `foveation` on <XR>. Default is `0`
        foveation,
        // `XRSession` reference-space type. This can be configured as `referenceSpace` on <XR>. Default is `local-floor`
        referenceSpace
    } = useXR()

    // render loop
    useFrame((rootState, delta) => {
        if (isPresenting) {
            const {gl} = rootState
            const xrCamera = gl.xr.getCamera()
            const cameraControls = sceneViewModel.cameraControls
            if (cameraControls) {
                const distance = cameraControls.distance
                const direction = xrCamera.getWorldDirection(new Vector3())
                const position = player.position;
                const target = direction.multiplyScalar(distance)
                const azimuthAngle = Math.atan2(direction.x, direction.z)
                const polarAngle = Math.acos(direction.y)
                cameraControls.rotate(azimuthAngle, polarAngle, false)
                cameraControls.setLookAt(position.x, position.y, position.z, target.x, target.y, target.z, false)
            }
        }
    }, 1)

    return (
        <>
            {children}
        </>
    )
}