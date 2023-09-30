import { makeAutoObservable } from "mobx";
import { Vector3 } from "three";
import { RootState } from "@react-three/fiber";
import { CesiumTerrainProvider, createWorldTerrainAsync, Viewer as CesiumViewer } from "cesium";

export class SceneViewModel {

    // identity
    name: string = ''

    // position
    geodeticCenter: Vector3 = new Vector3()
    geocentricCenter: Vector3 = new Vector3()

    // cesium
    cesiumTerrainProviderFactory: Promise<CesiumTerrainProvider> = createWorldTerrainAsync()
    cesiumViewer: CesiumViewer | null = null

    // three
    threeRootState: RootState | null = null

    constructor() {
        makeAutoObservable(this)
    }
}