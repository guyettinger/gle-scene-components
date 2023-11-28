import { ReactElement } from "react";
import { Vector3 } from "three";
import { Cartesian3, Ellipsoid } from "cesium";
import {
    getScenePositionForCartesian,
    getScenePositionForLongitudeLatitudeHeight,
    getSceneSurfaceNormalForLongitudeLatitudeHeight
} from "../../services/projection/projectionService";
import { defaultSceneExtensionGenerator, SceneExtension, SceneExtensionGenerator } from "../../extensions";
import { SceneContentProps } from "../../components";
import { SceneProps } from "../../components/Scene";
import { convertVector3Prop } from "../../services";

export class SceneModel {

    // name
    name: string

    // scene center
    sceneCenter: Vector3 = new Vector3(0, 0, 0)
    sceneCenterLongitudeLatitudeHeight: Vector3
    sceneCenterCartesian: Cartesian3 = new Cartesian3()

    // scene content
    sceneContent: ReactElement<SceneContentProps>

    // scene extensions
    sceneExtensionGenerator: SceneExtensionGenerator
    sceneExtensions: Map<string, SceneExtension> = new Map<string, SceneExtension>()

    constructor(
        public sceneProperties: SceneProps
    ) {
        // scene name
        this.name = sceneProperties.name

        // scene center
        this.sceneCenterLongitudeLatitudeHeight = convertVector3Prop(this.sceneProperties.sceneCenterLongitudeLatitudeHeight)
        Cartesian3.fromDegrees(
            this.sceneCenterLongitudeLatitudeHeight.x,
            this.sceneCenterLongitudeLatitudeHeight.y,
            this.sceneCenterLongitudeLatitudeHeight.z,
            Ellipsoid.WGS84,
            this.sceneCenterCartesian
        )

        // scene content
        this.sceneContent = sceneProperties.children

        // scene extensions
        this.sceneExtensionGenerator = sceneProperties.sceneExtensionGenerator ?? defaultSceneExtensionGenerator
        const sceneExtensions = this.sceneExtensionGenerator(this)
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