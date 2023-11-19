import { RootState, ThreeEvent } from "@react-three/fiber";
import { OGC3DTile } from "gle-threedtiles";
import { SceneViewModel } from "../../models/sceneView";
import { SceneViewForegroundLayerExtension } from "../sceneViewForegroundLayerExtension";
import { Ogc3DTilesSceneExtension } from "./ogc3DTilesSceneExtension";

export class Ogc3DTilesSceneViewForegroundLayerExtension extends SceneViewForegroundLayerExtension {

    // tilesets
    ogc3DTiles: OGC3DTile[] = []

    constructor(
        name: string,
        sceneViewModel: SceneViewModel,
        public ogc3DTilesSceneExtension: Ogc3DTilesSceneExtension
    ) {
        super(name, sceneViewModel, ogc3DTilesSceneExtension)
    }

    render(state: RootState, delta: number) {
        // get three state
        const {gl, scene, camera} = state;
        this.ogc3DTiles.forEach((ogc3DTile: OGC3DTile) => {
            ogc3DTile.update(camera)
        })
    }

    performDoubleClick(e: ThreeEvent<MouseEvent>) {
        if (!e) return
        const intersection = e.point
        if (!intersection) return
        console.log('ogc 3D tiles intersection', intersection)
        this.sceneViewModel.setCameraTarget(intersection)
    }

    public addOGC3DTile = (ogc3DTile: OGC3DTile) => {
        if (!this.sceneModel) return
        this.ogc3DTiles.push(ogc3DTile)
    }
}