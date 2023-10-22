import { makeAutoObservable, observable, ObservableMap } from "mobx";
import { SceneModel } from "../../models";

export class SceneStore {

    sceneRegistry: ObservableMap<string, SceneModel> = observable.map<string, SceneModel>()

    constructor() {
        makeAutoObservable(this)
    }

    hasScene(name: string): boolean {
        return this.sceneRegistry.has(name)
    }

    getScene(name: string): SceneModel {
        const sceneModel = this.sceneRegistry.get(name)
        if (!sceneModel) throw Error('Not Found')
        return sceneModel
    }

    setScene(name: string, sceneModel: SceneModel) {
        this.sceneRegistry.set(name, sceneModel)
    }
}

export default new SceneStore()