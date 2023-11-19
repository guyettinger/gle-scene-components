import { SceneModel } from "../../models/scene";
import { SceneViewModel } from "../../models/sceneView";
import { SceneExtension } from "../sceneExtension";
import { GaussianSplatCloudsSceneViewForegroundLayerExtension } from "./gaussianSplatCloudsSceneViewForegroundLayerExtension";

export class GaussianSplatCloudsSceneExtension extends SceneExtension {

    constructor(name: string, sceneModel: SceneModel) {
        super(name, sceneModel)
    }

    createSceneViewExtension(sceneViewModel: SceneViewModel): GaussianSplatCloudsSceneViewForegroundLayerExtension {
        return new GaussianSplatCloudsSceneViewForegroundLayerExtension(this.name, sceneViewModel, this)
    }
}