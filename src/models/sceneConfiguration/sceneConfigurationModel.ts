import { SceneExtension, } from "../../extensions";
import { SceneModel } from "../scene";
import { SceneConfiguration } from "./sceneConfiguration.types";

export abstract class SceneConfigurationModel implements SceneConfiguration {
    abstract configureSceneExtensions(sceneModel: SceneModel): SceneExtension[]
}