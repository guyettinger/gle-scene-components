import { DefaultSceneStore, SceneStore } from '../scene';
import { DefaultSceneViewStore, SceneViewStore } from '../sceneView';

export type RootStore = {
  sceneStore: SceneStore;
  sceneViewStore: SceneViewStore;
};

const rootStore: RootStore = {
  sceneStore: DefaultSceneStore,
  sceneViewStore: DefaultSceneViewStore,
};

export default rootStore;
