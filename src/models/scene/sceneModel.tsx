import { ReactElement } from "react";
import { Vector3 } from "three";
import {
    Cartesian3,
    Ellipsoid
} from "cesium";
import {
    getScenePositionForCartesian,
    getScenePositionForLongitudeLatitudeHeight,
    getSceneSurfaceNormalForLongitudeLatitudeHeight
} from "../../services/projection/projectionService";
import { SceneExtensionModel } from "../sceneExtension";
import {
    ExtensionNames,
    GaussianSplatCloudsSceneExtension,
    Ogc3DTilesSceneExtension,
    PointCloudsSceneExtension,
    CesiumSceneExtension,
    ThreeSceneExtension
} from "../../extensions";
import { SceneContentProps } from "../../components";

export class SceneModel {

    // scene center
    sceneCenter: Vector3 = new Vector3(0, 0, 0)
    sceneCenterCartesian: Cartesian3 = new Cartesian3()

    // scene extensions
    sceneExtensions: Map<string, SceneExtensionModel> = new Map<string, SceneExtensionModel>()

    constructor(
        public name: string,
        public sceneCenterLongitudeLatitudeHeight: Vector3,
        public sceneContent: ReactElement<SceneContentProps>,
    ) {
        // initialize scene center
        Cartesian3.fromDegrees(
            sceneCenterLongitudeLatitudeHeight.x,
            sceneCenterLongitudeLatitudeHeight.y,
            sceneCenterLongitudeLatitudeHeight.z,
            Ellipsoid.WGS84,
            this.sceneCenterCartesian
        )

        // three
        const threeSceneExtensionModel = new ThreeSceneExtension(ExtensionNames.Three, this)
        this.sceneExtensions.set(threeSceneExtensionModel.name, threeSceneExtensionModel)

        // gaussian splat clouds
        const gaussianSplatCloudsSceneExtensionModel = new GaussianSplatCloudsSceneExtension(ExtensionNames.GaussianSplatClouds, this)
        this.sceneExtensions.set(gaussianSplatCloudsSceneExtensionModel.name, gaussianSplatCloudsSceneExtensionModel)

        // point clouds
        const pointCloudsSceneExtensionModel = new PointCloudsSceneExtension(ExtensionNames.PointClouds, this)
        this.sceneExtensions.set(pointCloudsSceneExtensionModel.name, pointCloudsSceneExtensionModel)

        // OGC 3D Tiles
        const ogc3DTilesSceneExtensionModel = new Ogc3DTilesSceneExtension(ExtensionNames.OGC3DTiles, this)
        this.sceneExtensions.set(ogc3DTilesSceneExtensionModel.name, ogc3DTilesSceneExtensionModel)

        // cesium
        const cesiumSceneExtensionModel = new CesiumSceneExtension(ExtensionNames.Cesium, this)
        this.sceneExtensions.set(cesiumSceneExtensionModel.name, cesiumSceneExtensionModel)
    }

    getScenePositionForLongitudeLatitudeHeight(longitudeLatitudeHeight: Vector3, scenePosition = new Vector3()): Vector3 {
        getScenePositionForLongitudeLatitudeHeight(this.sceneCenter, this.sceneCenterCartesian, longitudeLatitudeHeight, scenePosition)
        return scenePosition
    }

    getScenePositionForCartesian(scenePositionCartesian: Cartesian3, scenePosition = new Vector3()): Vector3 {
        getScenePositionForCartesian(this.sceneCenter, this.sceneCenterCartesian, scenePositionCartesian, scenePosition)
        return scenePosition
    }

    getSceneSurfaceNormalForLongitudeLatitudeHeight(longitudeLatitudeHeight: Vector3, sceneSurfaceNormal = new Vector3()): Vector3 {
        getSceneSurfaceNormalForLongitudeLatitudeHeight(longitudeLatitudeHeight, sceneSurfaceNormal)
        return sceneSurfaceNormal
    }
}