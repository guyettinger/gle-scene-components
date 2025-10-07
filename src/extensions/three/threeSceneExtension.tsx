import { ReactNode } from 'react';
import { getChildrenByType } from 'react-nanny';
import { SceneModel } from '../../models/scene';
import { SceneViewModel } from '../../models/sceneView';
import { SceneExtension } from '../sceneExtension';
import { ThreeSceneContent } from './components';
import { ThreeSceneViewExtension } from './threeSceneViewExtension';

export class ThreeSceneExtension extends SceneExtension {
  // three scene
  public threeScene: ReactNode;

  constructor(name: string, sceneModel: SceneModel) {
    super(name, sceneModel);

    // using the scene content
    const { sceneContent } = sceneModel;

    // find the three scene content
    const threeSceneNodes = getChildrenByType(sceneContent.props.children, [ThreeSceneContent]);

    // set the three scene or use the default
    let threeScene = threeSceneNodes?.[0];
    this.threeScene = threeScene ? threeScene : <group></group>;
  }

  createSceneViewExtension(sceneViewModel: SceneViewModel): ThreeSceneViewExtension {
    return new ThreeSceneViewExtension(this.name, sceneViewModel, this);
  }
}
