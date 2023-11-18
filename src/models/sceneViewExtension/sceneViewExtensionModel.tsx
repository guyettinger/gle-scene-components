import { SceneModel } from "../scene";
import { SceneViewModel } from "../sceneView";
import { SceneExtensionModel } from "../sceneExtension";
import { RootState } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";

export abstract class SceneViewExtensionModel {

    // life cycle
    initialized: boolean = false

    // scene model
    sceneModel: SceneModel

    protected constructor(public name: string, public sceneViewModel: SceneViewModel, public sceneExtensionModel: SceneExtensionModel) {
        this.sceneModel = this.sceneViewModel.sceneModel
    }

    abstract initialize(state: RootState, delta: number): void

    abstract render(state: RootState, delta: number): void

    syncCameras(cameraControls: CameraControls) {
        // override
    }
}