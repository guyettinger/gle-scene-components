import { SceneModel } from "../../models/scene";
import { SceneExtensionModel } from "../../models/sceneExtension";
import { SceneViewModel } from "../../models/sceneView";
import { GaussianSplatCloudsSceneViewExtension } from "./gaussianSplatCloudsSceneViewExtension";

export class GaussianSplatCloudsSceneExtension extends SceneExtensionModel {

    constructor(name: string, sceneModel: SceneModel) {
        super(name, sceneModel)
    }

    createSceneViewExtension(sceneViewModel: SceneViewModel): GaussianSplatCloudsSceneViewExtension {
        return new GaussianSplatCloudsSceneViewExtension(this.name, sceneViewModel, this)
    }
}