import { SceneModel } from "../../models/scene";
import { SceneExtensionModel } from "../../models/sceneExtension";
import { SceneViewModel } from "../../models/sceneView";
import { Ogc3DTilesSceneViewExtension } from "./ogc3DTilesSceneViewExtension";

export class Ogc3DTilesSceneExtension extends SceneExtensionModel {

    constructor(name: string, sceneModel: SceneModel) {
        super(name, sceneModel)
    }

    createSceneViewExtension(sceneViewModel: SceneViewModel): Ogc3DTilesSceneViewExtension {
        return new Ogc3DTilesSceneViewExtension(this.name, sceneViewModel, this)
    }
}