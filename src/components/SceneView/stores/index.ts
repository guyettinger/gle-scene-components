import sceneViewStore, { SceneViewStore } from "./sceneViewStore";
import sceneStore, { SceneStore } from "./sceneStore";

export type RootStore = {
    sceneStore: SceneStore
    sceneViewStore: SceneViewStore
}

const rootStore: RootStore = {
    sceneStore: sceneStore,
    sceneViewStore: sceneViewStore
}

export default rootStore;