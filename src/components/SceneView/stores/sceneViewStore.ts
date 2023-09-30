import { makeAutoObservable, observable, ObservableMap } from "mobx";
import { Vector3 } from "three";
import { SceneViewModel } from "../models/sceneViewModel";
import { toGeocentric } from "../services/projectionService";

const farmGeodeticCenter = new Vector3(-83.764977, 34.401379, 400.0)
const geodeticCenter = new Vector3(farmGeodeticCenter.x, farmGeodeticCenter.y, farmGeodeticCenter.z + 100)
const geocentricCenter = toGeocentric(geodeticCenter.x, geodeticCenter.y, geodeticCenter.z);

export class SceneViewStore {

    sceneViewRegistry: ObservableMap<string, SceneViewModel> = observable.map<string, SceneViewModel>()

    constructor() {
        makeAutoObservable(this);
    }

    hasSceneView(name: string): boolean {
        return this.sceneViewRegistry.has(name)
    }

    getSceneView(name: string): SceneViewModel {
        const sceneViewModel = this.sceneViewRegistry.get(name)
        if (!sceneViewModel) throw Error('Not Found')
        return sceneViewModel
    }

    createSceneView(name: string): SceneViewModel {
        if (this.hasSceneView(name)) {
            return this.getSceneView(name)
        } else {
            const sceneView = new SceneViewModel()
            sceneView.name = name
            sceneView.geodeticCenter = geodeticCenter
            sceneView.geocentricCenter = geocentricCenter
            this.sceneViewRegistry.set(name, sceneView)
            return sceneView
        }
    }
}

export default new SceneViewStore()