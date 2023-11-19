import { SceneExtension } from "../../extensions";
import { SceneModel } from "../scene";

export interface SceneConfiguration {
    configureSceneExtensions: (sceneModel: SceneModel) => SceneExtension[]
}