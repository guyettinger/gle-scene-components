import { ReactElement } from "react";
import { SceneViewModel } from "../models/sceneView";
import { SceneExtension } from "./sceneExtension";
import { SceneViewExtension } from "./sceneViewExtension";
import { SceneViewForegroundProps } from "./sceneViewExtension.types";

export abstract class SceneViewForegroundExtension extends SceneViewExtension {
    protected constructor(public name: string,
                          public sceneViewModel: SceneViewModel,
                          public sceneExtension: SceneExtension) {
        super(name, sceneViewModel, sceneExtension)
    }

    abstract createForegroundView(sceneViewForegroundProps:SceneViewForegroundProps): ReactElement<SceneViewForegroundProps>
}