import { RootState } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { SceneModel } from "../scene";
import { SceneViewModel } from "../sceneView";
import { SceneExtensionModel } from "../sceneExtension";

export abstract class SceneViewExtensionModel {

    // initialization
    initialized: boolean = false

    // scene model
    sceneModel: SceneModel

    protected constructor(
        public name: string,
        public sceneViewModel: SceneViewModel,
        public sceneExtensionModel: SceneExtensionModel
    ) {
        this.sceneModel = this.sceneViewModel.sceneModel
    }

    initialize(state: RootState, delta: number): void {
        // override
    }

    render(state: RootState, delta: number): void {
        // override
    }

    syncCameras(cameraControls: CameraControls): void {
        // override
    }

    invalidate(frames?: number) {
        this.sceneViewModel.invalidate(frames)
    }
}