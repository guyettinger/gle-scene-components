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
import {
    SceneExtensionNames,
    GaussianSplatCloudsSceneExtension,
    Ogc3DTilesSceneExtension,
    PointCloudsSceneExtension,
    CesiumSceneExtension,
    ThreeSceneExtension,
    SceneExtension
} from "../../extensions";
import { SceneContentProps } from "../../components";

export class SceneModel {

    // scene center
    sceneCenter: Vector3 = new Vector3(0, 0, 0)
    sceneCenterCartesian: Cartesian3 = new Cartesian3()

    // scene extensions
    sceneExtensions: Map<string, SceneExtension> = new Map<string, SceneExtension>()

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
        const threeSceneExtension = new ThreeSceneExtension(SceneExtensionNames.Three, this)
        this.sceneExtensions.set(threeSceneExtension.name, threeSceneExtension)

        // gaussian splat clouds
        const gaussianSplatCloudsSceneExtension = new GaussianSplatCloudsSceneExtension(SceneExtensionNames.GaussianSplatClouds, this)
        this.sceneExtensions.set(gaussianSplatCloudsSceneExtension.name, gaussianSplatCloudsSceneExtension)

        // point clouds
        const pointCloudsSceneExtension = new PointCloudsSceneExtension(SceneExtensionNames.PointClouds, this)
        this.sceneExtensions.set(pointCloudsSceneExtension.name, pointCloudsSceneExtension)

        // OGC 3D Tiles
        const ogc3DTilesSceneExtension = new Ogc3DTilesSceneExtension(SceneExtensionNames.OGC3DTiles, this)
        this.sceneExtensions.set(ogc3DTilesSceneExtension.name, ogc3DTilesSceneExtension)

        // cesium
        const cesiumSceneExtension = new CesiumSceneExtension(SceneExtensionNames.Cesium, this)
        this.sceneExtensions.set(cesiumSceneExtension.name, cesiumSceneExtension)
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