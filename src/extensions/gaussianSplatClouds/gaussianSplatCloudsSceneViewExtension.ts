import { RootState, ThreeEvent } from "@react-three/fiber";
import { Viewer as GaussianSplatViewer } from "gle-gaussian-splat-3d";
import { SceneViewModel } from "../../models/sceneView";
import { SceneViewExtensionModel } from "../../models/sceneViewExtension";
import { GaussianSplatCloudsSceneExtension } from "./gaussianSplatCloudsSceneExtension";

export class GaussianSplatCloudsSceneViewExtension extends SceneViewExtensionModel {

    // gaussian splat viewer
    gaussianSplatViewerInitialized: boolean = false
    gaussianSplatViewer: GaussianSplatViewer | null = null

    constructor(
        name: string,
        sceneViewModel: SceneViewModel,
        public gaussianSplatCloudSceneExtension: GaussianSplatCloudsSceneExtension
    ) {
        super(name, sceneViewModel, gaussianSplatCloudSceneExtension)
    }

    initialize(state: RootState, delta: number): void {
    }

    render(state: RootState, delta: number) {
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
        console.log('gaussian splat cloud intersection', intersection)
        this.sceneViewModel.setCameraTarget(intersection)
    }
}