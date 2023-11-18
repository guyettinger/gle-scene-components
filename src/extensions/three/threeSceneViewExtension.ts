import { RootState } from "@react-three/fiber";
import { SceneViewModel } from "../../models/sceneView";
import { ThreeSceneExtension } from "./threeSceneExtension";
import { SceneViewExtensionModel } from "../../models/sceneViewExtension";

export class ThreeSceneViewExtension extends SceneViewExtensionModel {

    constructor(
        public name: string,
        public sceneViewModel: SceneViewModel,
        public threeSceneExtension: ThreeSceneExtension
    ) {
        super(name, sceneViewModel, threeSceneExtension)
    }

    initialize(state: RootState, delta: number): void {
    }

    render(state: RootState, delta: number) {
        // get three state
        const {gl, scene, camera} = state;

        // render scene
        gl.render(scene, camera)
    }
}