import { RootState, ThreeEvent } from "@react-three/fiber";
import { SceneViewModel } from "../sceneView";
import { SceneModel } from "../scene";
import { Viewer as GaussianSplatViewer } from "gle-gaussian-splat-3d";

export class GaussianSplatCloudsSceneViewModel {

    // scene model
    sceneModel: SceneModel

    // gaussian splat viewer
    gaussianSplatViewerInitialized: boolean = false
    gaussianSplatViewer: GaussianSplatViewer | null = null

    constructor(
        public name: string,
        public sceneViewModel: SceneViewModel
    ) {
        this.sceneModel = sceneViewModel.sceneModel
    }

    render = (state: RootState, delta: number) => {
        // get three state
        const {gl, scene, camera} = state;

        // render gaussian splats
        const gaussianSplatViewer = this.gaussianSplatViewer
        if (gaussianSplatViewer && this.gaussianSplatViewerInitialized) {
            gaussianSplatViewer.update()
            gaussianSplatViewer.render()
        }
    }

    performDoubleClick = (e: ThreeEvent<MouseEvent>) => {
        if (!e) return
        const intersection = e.point
        if (!intersection) return
        console.log('point cloud intersection', intersection)
        this.sceneViewModel.setCameraTarget(intersection)
    }
}