import { SceneViewModel } from '../models/sceneView';
import { SceneExtension } from './sceneExtension';
import { SceneViewExtension } from './sceneViewExtension';

export abstract class SceneViewForegroundLayerExtension extends SceneViewExtension {
  protected constructor(
    public name: string,
    public sceneViewModel: SceneViewModel,
    public sceneExtension: SceneExtension
  ) {
    super(name, sceneViewModel, sceneExtension);
  }
}
