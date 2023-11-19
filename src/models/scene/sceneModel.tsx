import { ReactElement } from "react";
import { Vector3 } from "three";
import { Cartesian3, Ellipsoid } from "cesium";
import {
    getScenePositionForCartesian,
    getScenePositionForLongitudeLatitudeHeight,
    getSceneSurfaceNormalForLongitudeLatitudeHeight
} from "../../services/projection/projectionService";
import { SceneExtension } from "../../extensions";
import { SceneContentProps } from "../../components";
import { DefaultSceneConfigurationModel, SceneConfiguration } from "../sceneConfiguration";


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
        public sceneConfiguration: SceneConfiguration = new DefaultSceneConfigurationModel()
    ) {
        // initialize scene center
        Cartesian3.fromDegrees(
            sceneCenterLongitudeLatitudeHeight.x,
            sceneCenterLongitudeLatitudeHeight.y,
            sceneCenterLongitudeLatitudeHeight.z,
            Ellipsoid.WGS84,
            this.sceneCenterCartesian
        )

        // configure scene extensions
        const sceneExtensions = sceneConfiguration.configureSceneExtensions(this)
        sceneExtensions.forEach((sceneExtension) => {
            this.sceneExtensions.set(sceneExtension.name, sceneExtension)
        })
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