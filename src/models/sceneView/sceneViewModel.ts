import { RootState } from "@react-three/fiber";
import { Vector3 } from "three";
import { DebugModelMatrixPrimitive, Viewer as CesiumViewer } from "cesium";
import { CameraControls } from "@react-three/drei";
import { Viewer as GaussianSplatViewer } from "gle-gs3d"
import { SceneModel } from "../scene/sceneModel";

export class SceneViewModel {

    // cameras
    camerasInitialized: boolean = false

    // camera controls
    cameraControls: CameraControls | null = null

    // cesium
    cesiumViewer: CesiumViewer | null = null

    // gaussian splat viewer
    gaussianSplatViewer: GaussianSplatViewer | null = null

    // three
    threeRootState: RootState | null = null

    // debug
    debugModelMatrixPrimitive: DebugModelMatrixPrimitive | null = null

    constructor(
        public name: string,
        public sceneModel: SceneModel
    ) {
    }

    moveCameraTo = (longitudeLatitudeHeight: Vector3) => {
        // get current camera target
        const currentTarget = this.cameraControls?.getTarget(new Vector3())
        if (!currentTarget) return

        // get current camera position
        const currentPosition = this.cameraControls?.getPosition(new Vector3())
        if (!currentPosition) return

        // get offset between current camera position and target
        const positionOffset = new Vector3().copy(currentPosition).sub(currentTarget)

        // determine the next camera target
        const nextTarget = new Vector3()
        this.sceneModel.getScenePositionForLongitudeLatitudeHeight(longitudeLatitudeHeight, nextTarget)
        this.cameraControls?.setTarget(nextTarget.x, nextTarget.y, nextTarget.z)

        // determine the next camera position
        const nextPosition = new Vector3().copy(nextTarget).add(positionOffset)
        this.cameraControls?.setPosition(nextPosition.x, nextPosition.y, nextPosition.z)
    }

}