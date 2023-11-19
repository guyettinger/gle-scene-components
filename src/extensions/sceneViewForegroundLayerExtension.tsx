import { SceneViewModel } from "../models/sceneView";
import { SceneViewExtension } from "./sceneViewExtension";
import { SceneExtension } from "./sceneExtension";

export abstract class SceneViewForegroundLayerExtension extends SceneViewExtension {
    protected constructor(public name: string,
                          public sceneViewModel: SceneViewModel,
                          public sceneExtension: SceneExtension
    ) {
        super(name, sceneViewModel, sceneExtension)
    }
}