import { RootState } from "@react-three/fiber";
import { SceneViewModel } from "../../models/sceneView";
import { SceneViewExtensionModel } from "../../models/sceneViewExtension";
import { ThreeSceneExtension } from "./threeSceneExtension";

export class ThreeSceneViewExtension extends SceneViewExtensionModel {

    constructor(
        public name: string,
        public sceneViewModel: SceneViewModel,
        public threeSceneExtension: ThreeSceneExtension
    ) {
        super(name, sceneViewModel, threeSceneExtension)
    }

    render(state: RootState, delta: number) {
        // get three state
        const {gl, scene, camera} = state;

        // render scene
        gl.render(scene, camera)
    }
}