import { ReactNode } from "react";
import { getChildrenByType } from "react-nanny";
import { Cartographic, CesiumTerrainProvider, createWorldTerrainAsync, Ion, sampleTerrainMostDetailed } from "cesium";
import { Globe, Sun } from "resium";
import { SceneModel } from "../../models/scene";
import { SceneViewModel } from "../../models/sceneView";
import { SceneExtension } from "../sceneExtension";
import { CesiumSceneViewBackgroundExtension } from "./cesiumSceneViewBackgroundExtension";
import { CesiumSceneContent } from "./components";

export class CesiumSceneExtension extends SceneExtension {

    // cesium scene
    cesiumScene: ReactNode

    // cesium terrain
    cesiumTerrainProvider: CesiumTerrainProvider | null = null
    cesiumTerrainProviderFactory: Promise<CesiumTerrainProvider> | null = null

    constructor(name: string, sceneModel: SceneModel) {
        super(name, sceneModel)

        // if there is a cesium ion access token, use it
        const cesiumAccessToken = sceneModel?.sceneProperties?.cesiumIonAccessToken
        if (!!cesiumAccessToken) {
            Ion.defaultAccessToken = cesiumAccessToken
        }

        // create the terrain provider
        this.cesiumTerrainProviderFactory = new Promise(async (resolve) => {
            const cesiumTerrainProvider = await createWorldTerrainAsync()
            this.cesiumTerrainProvider = cesiumTerrainProvider
            resolve(cesiumTerrainProvider)
        })

        // using the scene content
        const {sceneContent} = sceneModel

        // find the cesium scene content
        const cesiumSceneNodes = getChildrenByType(sceneContent.props.children, [CesiumSceneContent])

        // set the cesium scene or use the default
        let cesiumScene = cesiumSceneNodes?.[0]
        this.cesiumScene = cesiumScene
            ? cesiumScene
            : <>
                <Sun glowFactor={20}/>
                <Globe enableLighting={true}/>
            </>
    }

    createSceneViewExtension(sceneViewModel: SceneViewModel): CesiumSceneViewBackgroundExtension {
        return new CesiumSceneViewBackgroundExtension(this.name, sceneViewModel, this)
    }

    queryHeightAtLongitudeLatitude = async (longitude: number, latitude: number): Promise<number> => {
        return this.sampleTerrainHeightAtCartographicPosition(Cartographic.fromDegrees(longitude, latitude)).then((cartographic) => {
            return cartographic.height
        })
    }

    sampleTerrainHeightAtCartographicPosition = async (cartographicPosition: Cartographic): Promise<Cartographic> => {
        const positionArray = await this.sampleTerrainHeightAtCartographicPositions([cartographicPosition])
        return positionArray[0]
    }

    sampleTerrainHeightAtCartographicPositions = async (cartographicPositionArray: Cartographic[]): Promise<Cartographic[]> => {
        if (!this.cesiumTerrainProvider) throw new Error('Cesium Terrain Provider not initialized')
        return await sampleTerrainMostDetailed(this.cesiumTerrainProvider, cartographicPositionArray)
    }
}