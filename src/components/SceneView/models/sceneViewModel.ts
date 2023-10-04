import { makeAutoObservable } from "mobx";
import { Vector3 } from "three";
import { RootState } from "@react-three/fiber";
import { CesiumTerrainProvider, createWorldTerrainAsync, Viewer as CesiumViewer } from "cesium";
import { SceneModel } from "./sceneModel";

export class SceneViewModel {

    // cesium
    cesiumTerrainProviderFactory: Promise<CesiumTerrainProvider> = createWorldTerrainAsync()
    cesiumViewer: CesiumViewer | null = null

    // three
    threeRootState: RootState | null = null

    constructor(
        public name: string,
        public sceneModel: SceneModel,
        public geodeticCenter: Vector3
    ) {
        makeAutoObservable(this)
    }
}