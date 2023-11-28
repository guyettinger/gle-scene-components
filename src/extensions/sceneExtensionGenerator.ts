import { SceneModel } from "../models";
import { SceneExtension } from "./sceneExtension";
import { ThreeSceneExtension } from "./three";
import { SceneExtensionNames } from "./sceneExtensionNames";
import { GaussianSplatCloudsSceneExtension } from "./gaussianSplatClouds";
import { PointCloudsSceneExtension } from "./pointClouds";
import { Ogc3DTilesSceneExtension } from "./ogc3DTiles";
import { CesiumSceneExtension } from "./cesium";

export type SceneExtensionGenerator = (sceneModel: SceneModel) => SceneExtension[]

export const defaultSceneExtensionGenerator:SceneExtensionGenerator = (sceneModel: SceneModel): SceneExtension[] => {
    return [
        new ThreeSceneExtension(SceneExtensionNames.Three, sceneModel),
        new GaussianSplatCloudsSceneExtension(SceneExtensionNames.GaussianSplatClouds, sceneModel),
        new PointCloudsSceneExtension(SceneExtensionNames.PointClouds, sceneModel),
        new Ogc3DTilesSceneExtension(SceneExtensionNames.OGC3DTiles, sceneModel),
        new CesiumSceneExtension(SceneExtensionNames.Cesium, sceneModel)
    ]
}