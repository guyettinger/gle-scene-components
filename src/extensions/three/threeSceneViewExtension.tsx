import { ReactElement } from "react";
import { RootState } from "@react-three/fiber";
import { SceneViewModel } from "../../models/sceneView";
import { ThreeSceneExtension } from "./threeSceneExtension";
import { SceneViewForegroundExtension } from "../../models/sceneViewExtension/sceneViewForegroundExtension";
import { ThreeScene, ThreeSceneGroup, ThreeView } from "../../components";
import { ThreeSceneGroupProps } from "../../components/ThreeView/ThreeView.types";

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