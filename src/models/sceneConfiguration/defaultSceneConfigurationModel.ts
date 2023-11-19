import {
    CesiumSceneExtension,
    GaussianSplatCloudsSceneExtension,
    Ogc3DTilesSceneExtension,
    PointCloudsSceneExtension,
    SceneExtension,
    SceneExtensionNames,
    ThreeSceneExtension
} from "../../extensions";
import { SceneModel } from "../scene";
import { SceneConfigurationModel } from "./sceneConfigurationModel";

export class DefaultSceneConfigurationModel extends SceneConfigurationModel {
    configureSceneExtensions(sceneModel: SceneModel): SceneExtension[] {
        return [
            new ThreeSceneExtension(SceneExtensionNames.Three, sceneModel),
            new GaussianSplatCloudsSceneExtension(SceneExtensionNames.GaussianSplatClouds, sceneModel),
            new PointCloudsSceneExtension(SceneExtensionNames.PointClouds, sceneModel),
            new Ogc3DTilesSceneExtension(SceneExtensionNames.OGC3DTiles, sceneModel),
            new CesiumSceneExtension(SceneExtensionNames.Cesium, sceneModel)
        ]
    }
}