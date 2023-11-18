import { ReactNode } from "react";
import { Cartographic, CesiumTerrainProvider, createWorldTerrainAsync, sampleTerrainMostDetailed } from "cesium";
import { getChildrenByType } from "react-nanny";
import { CesiumSceneContent } from "../../components";
import { Globe, Sun } from "resium";
import { CesiumSceneViewExtension } from "./cesiumSceneViewExtension";
import { SceneModel } from "../../models/scene";
import { SceneExtensionModel } from "../../models/sceneExtension";
import { SceneViewModel } from "../../models/sceneView";

export class CesiumSceneExtension extends SceneExtensionModel {

    // cesium terrain
    cesiumTerrainProvider: CesiumTerrainProvider | null = null
    cesiumTerrainProviderFactory: Promise<CesiumTerrainProvider> = new Promise(async (resolve) => {
        const cesiumTerrainProvider = await createWorldTerrainAsync()
        this.cesiumTerrainProvider = cesiumTerrainProvider
        resolve(cesiumTerrainProvider);
    })

    // cesium scene
    public cesiumScene: ReactNode

    constructor(name: string, sceneModel: SceneModel) {
        super(name, sceneModel)

        const {sceneContent} = sceneModel;
        const cesiumSceneNodes = getChildrenByType(sceneContent.props.children, [CesiumSceneContent]);
        let cesiumScene = cesiumSceneNodes?.[0]
        this.cesiumScene = cesiumScene
            ? cesiumScene
            : <>
                <Sun glowFactor={20}/>
                <Globe enableLighting={true}/>
            </>
    }

    createSceneViewExtension(sceneViewModel: SceneViewModel): CesiumSceneViewExtension {
        return new CesiumSceneViewExtension(this.name, sceneViewModel, this)
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