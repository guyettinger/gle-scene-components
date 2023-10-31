import { makeAutoObservable } from "mobx";
import { Vector3 } from "three";
import {
    Cartesian3,
    Cartographic,
    CesiumTerrainProvider,
    createWorldTerrainAsync,
    Ellipsoid,
    sampleTerrainMostDetailed
} from "cesium";
import { PointCloudOctree, Potree } from "gle-potree";
import { getEastNorthUpOffset } from "../../services/projection/projectionService";

export class SceneModel {

    // scene center
    sceneCenter: Vector3 = new Vector3(0, 0, 0)
    sceneCenterCartesian: Cartesian3 = new Cartesian3()

    // cesium terrain
    cesiumTerrainProvider: CesiumTerrainProvider | null = null
    cesiumTerrainProviderFactory: Promise<CesiumTerrainProvider> = new Promise(async (resolve) => {
        const cesiumTerrainProvider = await createWorldTerrainAsync()
        this.cesiumTerrainProvider = cesiumTerrainProvider
        resolve(cesiumTerrainProvider);
    })

    // point clouds
    potree = new Potree()
    pointClouds: PointCloudOctree[] = []

    get pointBudget(): number {
        return this.potree.pointBudget
    }

    set pointBudget(pointBudget: number) {
        this.potree.pointBudget = pointBudget
    }

    constructor(
        public name: string,
        public threeScene: JSX.Element,
        public geodeticCenter: Vector3
    ) {
        // initialize scene center
        Cartesian3.fromDegrees(geodeticCenter.x, geodeticCenter.y, geodeticCenter.z, Ellipsoid.WGS84, this.sceneCenterCartesian)

        // initialize point clouds
        this.pointBudget = 2_000_000

        // begin observation
        makeAutoObservable(this)
    }

    getScenePositionForLongitudeLatitudeHeight = (longitudeLatitudeHeightVector: Vector3, scenePosition = new Vector3()): Vector3 => {
        const coordinateCartesian = Cartesian3.fromDegrees(longitudeLatitudeHeightVector.x, longitudeLatitudeHeightVector.y, longitudeLatitudeHeightVector.z)
        const offsetEastNorthUp = getEastNorthUpOffset(this.sceneCenterCartesian, coordinateCartesian)
        scenePosition.set(
            this.sceneCenter.x + -offsetEastNorthUp.x,
            this.sceneCenter.y + -offsetEastNorthUp.z,
            this.sceneCenter.z + offsetEastNorthUp.y
        )
        return scenePosition
    }

    getSceneSurfaceNormalForLongitudeLatitudeHeight = (longitudeLatitudeHeightVector: Vector3, sceneSurfaceNormal = new Vector3()): Vector3 => {
        const coordinateCartesian = Cartesian3.fromDegrees(longitudeLatitudeHeightVector.x, longitudeLatitudeHeightVector.y, longitudeLatitudeHeightVector.z)
        const geodeticSurfaceNormal = Ellipsoid.WGS84.geodeticSurfaceNormal(coordinateCartesian)
        sceneSurfaceNormal.set(
            geodeticSurfaceNormal.x,
            -geodeticSurfaceNormal.z,
            geodeticSurfaceNormal.y
        )
        return sceneSurfaceNormal
    }

    queryTerrainHeight = async (longitude: number, latitude: number): Promise<number> => {
        return this.sampleTerrainHeightAtCartographicPosition(new Cartographic(longitude, latitude)).then((cartographic) => {
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