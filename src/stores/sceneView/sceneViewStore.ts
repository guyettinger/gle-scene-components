import { makeAutoObservable, observable, ObservableMap } from "mobx";
import { SceneViewModel } from "../../models";

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

    setSceneView(name: string, sceneViewModel: SceneViewModel) {
        this.sceneViewRegistry.set(name, sceneViewModel)
    }
}

export default new SceneViewStore()