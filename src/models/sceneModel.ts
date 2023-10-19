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
import { PointCloudOctree, Potree } from "gle-three-loader";

export class SceneModel {

    // scene center
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