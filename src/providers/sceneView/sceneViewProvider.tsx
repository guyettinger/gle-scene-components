import { createContext, ReactNode, useContext } from 'react';
import { SceneViewModel } from '../../models';
import { useStore } from '../store';

export const SceneViewContext = createContext<SceneViewModel | null>(null);

export const SceneViewProvider = (props: {
  sceneViewModel: SceneViewModel;
  children: ReactNode;
}) => {
  const { sceneViewModel, children } = props;
  const { sceneViewStore } = useStore();
  if (!sceneViewStore.hasSceneView(sceneViewModel.name)) {
    sceneViewStore.setSceneView(sceneViewModel.name, sceneViewModel);
  }
  return <SceneViewContext.Provider value={sceneViewModel}>{children}</SceneViewContext.Provider>;
};

export const useSceneViewModel = () => {
  const sceneViewModel = useContext(SceneViewContext);
  if (!sceneViewModel) {
    throw new Error('useSceneViewModel must be used within a SceneViewContextProvider.');
  }
  return sceneViewModel;
};
