import { ReactElement } from "react";
import { RootState } from "@react-three/fiber";
import { SceneViewModel } from "../../models/sceneView";
import { SceneViewForegroundExtension } from "../sceneViewForegroundExtension";
import { ThreeSceneExtension } from "./threeSceneExtension";
import { ThreeScene, ThreeSceneGroup, ThreeView, ThreeSceneGroupProps } from "./components";

export class ThreeSceneViewExtension extends SceneViewForegroundExtension {

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

    createForegroundView(threeSceneGroupProps: ThreeSceneGroupProps): ReactElement<ThreeSceneGroupProps> {
        return (
            <ThreeView {...threeSceneGroupProps}>
                <ThreeScene>
                    <ThreeSceneGroup/>
                </ThreeScene>
            </ThreeView>
        )
    }
}