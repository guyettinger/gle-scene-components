import { RootState, ThreeEvent } from "@react-three/fiber";
import { Viewer as GaussianSplatViewer } from "gle-gaussian-splat-3d";
import { SceneViewModel } from "../../models/sceneView";
import { GaussianSplatCloudsSceneExtension } from "./gaussianSplatCloudsSceneExtension";
import { SceneViewForegroundLayerExtension } from "../sceneViewForegroundLayerExtension";

export class GaussianSplatCloudsSceneViewForegroundLayerExtension extends SceneViewForegroundLayerExtension {

    // gaussian splat viewers
    gaussianSplatViewerMap: Map<string, GaussianSplatViewer> = new Map<string, GaussianSplatViewer>()

    constructor(
        name: string,
        sceneViewModel: SceneViewModel,
        public gaussianSplatCloudSceneExtension: GaussianSplatCloudsSceneExtension
    ) {
        super(name, sceneViewModel, gaussianSplatCloudSceneExtension)
    }

    render(state: RootState, delta: number) {
        // render gaussian splats
        this.gaussianSplatViewerMap.forEach((gaussianSplatViewer) => {
            if (gaussianSplatViewer) {
                gaussianSplatViewer.update()
                gaussianSplatViewer.render()
            }
        })
    }

    performDoubleClick(e: ThreeEvent<MouseEvent>) {
        if (!e) return
        const intersection = e.point
        if (!intersection) return
        console.log('gaussian splat cloud intersection', intersection)
        this.sceneViewModel.setCameraTarget(intersection)
    }
}