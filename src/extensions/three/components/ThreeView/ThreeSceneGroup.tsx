import { useSceneViewModel } from '../../../../providers';
import { SceneExtensionNames, ThreeSceneViewExtension } from '../../../index';
import { ThreeSceneGroupProps } from './ThreeView.types';

export const ThreeSceneGroup = ({ ...groupProps }: ThreeSceneGroupProps) => {
  const sceneViewModel = useSceneViewModel();
  const threeSceneViewExtension = sceneViewModel.getSceneViewExtension<ThreeSceneViewExtension>(
    SceneExtensionNames.Three
  );
  const { threeScene } = threeSceneViewExtension.threeSceneExtension;
  const debug = sceneViewModel.debug;

  return (
    <group {...groupProps}>
      {threeScene}
      {debug && <axesHelper args={[5]} />}
    </group>
  );
};
