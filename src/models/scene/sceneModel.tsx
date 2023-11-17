import { ReactNode } from "react";
import { Vector3 } from "three";
import { Globe, Sun } from "resium";
import {
    Cartesian3,
    Cartographic,
    CesiumTerrainProvider,
    createWorldTerrainAsync,
    Ellipsoid,
    sampleTerrainMostDetailed
} from "cesium";
import {
    getScenePositionForCartesian,
    getScenePositionForLongitudeLatitudeHeight,
    getSceneSurfaceNormalForLongitudeLatitudeHeight
} from "../../services/projection/projectionService";
import { SceneExtensionModel } from "../sceneExtension";
import { GaussianSplatCloudsSceneExtension, Ogc3DTilesSceneExtension, PointCloudsSceneExtension } from "../../extensions";

export class SceneModel {

    // scene center
    sceneCenter: Vector3 = new Vector3(0, 0, 0)
    sceneCenterCartesian: Cartesian3 = new Cartesian3()

    // scene extensions
    sceneExtensions: Map<string, SceneExtensionModel> = new Map<string, SceneExtensionModel>()

    // cesium terrain
    cesiumTerrainProvider: CesiumTerrainProvider | null = null
    cesiumTerrainProviderFactory: Promise<CesiumTerrainProvider> = new Promise(async (resolve) => {
        const cesiumTerrainProvider = await createWorldTerrainAsync()
        this.cesiumTerrainProvider = cesiumTerrainProvider
        resolve(cesiumTerrainProvider);
    })

    constructor(
        public name: string,
        public sceneCenterLongitudeLatitudeHeight: Vector3,
        public threeScene?: ReactNode,
        public cesiumScene?: ReactNode
    ) {
        // initialize scene center
        Cartesian3.fromDegrees(
            sceneCenterLongitudeLatitudeHeight.x,
            sceneCenterLongitudeLatitudeHeight.y,
            sceneCenterLongitudeLatitudeHeight.z,
            Ellipsoid.WGS84,
            this.sceneCenterCartesian
        )

        // default three scene
        if (!this.threeScene) {
            this.threeScene = <group></group>
        }

        // default cesium scene
        if (!this.cesiumScene) {
            this.cesiumScene = <>
                <Sun glowFactor={20}/>
                <Globe enableLighting={true}/>
            </>
        }
        // gaussian splat clouds
        const gaussianSplatCloudsSceneExtensionModel = new GaussianSplatCloudsSceneExtension('gaussianSplatClouds', this)
        this.sceneExtensions.set(gaussianSplatCloudsSceneExtensionModel.name, gaussianSplatCloudsSceneExtensionModel)

        // point clouds
        const pointCloudsSceneExtensionModel = new PointCloudsSceneExtension('pointClouds', this)
        this.sceneExtensions.set(pointCloudsSceneExtensionModel.name, pointCloudsSceneExtensionModel)

        // OGC 3D Tiles
        const ogc3DTilesSceneExtensionModel = new Ogc3DTilesSceneExtension('ogc3DTiles', this)
        this.sceneExtensions.set(ogc3DTilesSceneExtensionModel.name, ogc3DTilesSceneExtensionModel)

    }

    getScenePositionForLongitudeLatitudeHeight = (longitudeLatitudeHeight: Vector3, scenePosition = new Vector3()): Vector3 => {
        getScenePositionForLongitudeLatitudeHeight(this.sceneCenter, this.sceneCenterCartesian, longitudeLatitudeHeight, scenePosition)
        return scenePosition
    }

    getScenePositionForCartesian = (scenePositionCartesian: Cartesian3, scenePosition = new Vector3()): Vector3 => {
        getScenePositionForCartesian(this.sceneCenter, this.sceneCenterCartesian, scenePositionCartesian, scenePosition)
        return scenePosition
    }

    getSceneSurfaceNormalForLongitudeLatitudeHeight = (longitudeLatitudeHeight: Vector3, sceneSurfaceNormal = new Vector3()): Vector3 => {
        getSceneSurfaceNormalForLongitudeLatitudeHeight(longitudeLatitudeHeight, sceneSurfaceNormal)
        return sceneSurfaceNormal
    }

    queryHeightAtLongitudeLatitude = async (longitude: number, latitude: number): Promise<number> => {
        return this.sampleTerrainHeightAtCartographicPosition(Cartographic.fromDegrees(longitude, latitude)).then((cartographic) => {
            return cartographic.height;
        })
    }

    sampleTerrainHeightAtCartographicPosition = async (cartographicPosition: Cartographic): Promise<Cartographic> => {
        const positionArray = await this.sampleTerrainHeightAtCartographicPositions([cartographicPosition])
        return positionArray[0]
    }

    sampleTerrainHeightAtCartographicPositions = async (cartographicPositionArray: Cartographic[]): Promise<Cartographic[]> => {
        if (!this.cesiumTerrainProvider) throw new Error('Cesium Terrain Provider not initialized')
        return await sampleTerrainMostDetailed(this.cesiumTerrainProvider, cartographicPositionArray);
    }
}