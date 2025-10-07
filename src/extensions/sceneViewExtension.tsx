import { CameraControls } from '@react-three/drei';
import { RootState } from '@react-three/fiber';
import { SceneModel } from '../models/scene';
import { SceneViewModel } from '../models/sceneView';
import { SceneExtension } from './sceneExtension';

export abstract class SceneViewExtension {
  // initialization
  initialized: boolean = false;

  // scene model
  sceneModel: SceneModel;

  protected constructor(
    public name: string,
    public sceneViewModel: SceneViewModel,
    public sceneExtension: SceneExtension
  ) {
    this.sceneModel = this.sceneViewModel.sceneModel;
  }

  initialize(state: RootState, delta: number): void {
    // override
  }

  render(state: RootState, delta: number): void {
    // override
  }

  syncCameras(cameraControls: CameraControls): void {
    // override
  }

  invalidate(frames?: number) {
    this.sceneViewModel.invalidate(frames);
  }
}
