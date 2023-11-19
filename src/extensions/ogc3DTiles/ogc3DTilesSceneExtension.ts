import { SceneModel } from "../../models/scene";
import { SceneViewModel } from "../../models/sceneView";
import { SceneExtension } from "../sceneExtension";
import { Ogc3DTilesSceneViewForegroundLayerExtension } from "./ogc3DTilesSceneViewForegroundLayerExtension";

export class Ogc3DTilesSceneExtension extends SceneExtension {

    constructor(name: string, sceneModel: SceneModel) {
        super(name, sceneModel)
    }

    createSceneViewExtension(sceneViewModel: SceneViewModel): Ogc3DTilesSceneViewForegroundLayerExtension {
        return new Ogc3DTilesSceneViewForegroundLayerExtension(this.name, sceneViewModel, this)
    }
}