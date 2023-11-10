import { Group } from "three";
import { RootState, ThreeEvent } from "@react-three/fiber";
import { OGC3DTile } from "gle-threedtiles";
import { SceneViewModel } from "../sceneView";
import { SceneModel } from "../scene";

export class Ogc3DTilesSceneViewModel {

    // scene model
    sceneModel: SceneModel

    // tilesets
    ogc3DTiles: OGC3DTile[] = []

    constructor(
        public name: string,
        public sceneViewModel: SceneViewModel
    ) {
        this.sceneModel = sceneViewModel.sceneModel
    }

    render = (state: RootState, delta: number) => {
        // get three state
        const {gl, scene, camera} = state;
        this.ogc3DTiles.forEach((ogc3DTile:OGC3DTile)=>{
            ogc3DTile.update(camera)
        })
    }

    performDoubleClick = (e: ThreeEvent<MouseEvent>) => {
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