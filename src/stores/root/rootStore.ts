import { SceneStore, DefaultSceneStore } from "../scene";
import { SceneViewStore, DefaultSceneViewStore } from "../sceneView";

export type RootStore = {
    sceneStore: SceneStore
    sceneViewStore: SceneViewStore
}

const rootStore: RootStore = {
    sceneStore: DefaultSceneStore,
    sceneViewStore: DefaultSceneViewStore
}

export default rootStore;