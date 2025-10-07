import styled from 'styled-components';
import { SceneProvider, SceneViewProvider, StoreProvider } from '../../providers';
import { SceneViewProps } from './SceneView.types';

const SceneViewContent = styled.div``;
export const SceneView = ({ sceneViewModel, ...divProps }: SceneViewProps) => {
  return (
    <SceneViewContent className="gle-scene-view" {...divProps}>
      <StoreProvider>
        <SceneProvider sceneModel={sceneViewModel.sceneModel}>
          <SceneViewProvider sceneViewModel={sceneViewModel}>
            {sceneViewModel
              .getSceneViewBackgroundExtensions()
              .map((sceneViewBackgroundExtension) => {
                return sceneViewBackgroundExtension.createBackgroundView({
                  key: sceneViewBackgroundExtension.name,
                  ...sceneViewModel.sceneViewBackgroundProps,
                });
              })}
            {sceneViewModel
              .getSceneViewForegroundExtensions()
              .map((sceneViewForegroundExtension) => {
                return sceneViewForegroundExtension.createForegroundView({
                  key: sceneViewForegroundExtension.name,
                  ...sceneViewModel.sceneViewForegroundProps,
                });
              })}
          </SceneViewProvider>
        </SceneProvider>
      </StoreProvider>
    </SceneViewContent>
  );
};
