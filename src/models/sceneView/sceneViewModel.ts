import { RootState } from "@react-three/fiber";
import { DebugModelMatrixPrimitive, Viewer as CesiumViewer } from "cesium";
import { Viewer as GaussianSplatViewer } from "gle-gs3d"
import { SceneModel } from "../scene/sceneModel";

export class SceneViewModel {

    // cesium
    cesiumViewer: CesiumViewer | null = null

    // gaussian splat viewer
    gaussianSplatViewer: GaussianSplatViewer | null = null

    // three
    threeRootState: RootState | null = null

    // cameras
    camerasInitialized: boolean = false

    // debug
    debugModelMatrixPrimitive: DebugModelMatrixPrimitive | null = null

    constructor(
        public name: string,
        public sceneModel: SceneModel
    ) {
    }

}