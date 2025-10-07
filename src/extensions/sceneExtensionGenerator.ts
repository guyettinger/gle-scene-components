import { SceneModel } from '../models';
import { CesiumSceneExtension } from './cesium';
import { GaussianSplatCloudsSceneExtension } from './gaussianSplatClouds';
import { Ogc3DTilesSceneExtension } from './ogc3DTiles';
import { PointCloudsSceneExtension } from './pointClouds';
import { SceneExtension } from './sceneExtension';
import { SceneExtensionNames } from './sceneExtensionNames';
import { ThreeSceneExtension } from './three';

export type SceneExtensionGenerator = (sceneModel: SceneModel) => SceneExtension[];

export const defaultSceneExtensionGenerator: SceneExtensionGenerator = (
  sceneModel: SceneModel
): SceneExtension[] => {
  return [
    new ThreeSceneExtension(SceneExtensionNames.Three, sceneModel),
    new GaussianSplatCloudsSceneExtension(SceneExtensionNames.GaussianSplatClouds, sceneModel),
    new PointCloudsSceneExtension(SceneExtensionNames.PointClouds, sceneModel),
    new Ogc3DTilesSceneExtension(SceneExtensionNames.OGC3DTiles, sceneModel),
    new CesiumSceneExtension(SceneExtensionNames.Cesium, sceneModel),
  ];
};
