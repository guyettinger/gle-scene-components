import { SceneModel } from "../scene";
import { SceneViewModel } from "../sceneView";
import { SceneViewExtensionModel } from "../sceneViewExtension";

export abstract class SceneExtensionModel {

    protected constructor(public name: string, public sceneModel: SceneModel) {
    }

    abstract createSceneViewExtension(sceneViewModel: SceneViewModel): SceneViewExtensionModel
}