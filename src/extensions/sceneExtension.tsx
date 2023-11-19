import { SceneModel } from "../models/scene";
import { SceneViewModel } from "../models/sceneView";
import { SceneViewExtension } from "./sceneViewExtension";

export abstract class SceneExtension {

    protected constructor(public name: string, public sceneModel: SceneModel) {
    }

    abstract createSceneViewExtension(sceneViewModel: SceneViewModel): SceneViewExtension

}