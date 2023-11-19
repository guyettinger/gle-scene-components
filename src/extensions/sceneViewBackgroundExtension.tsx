import { ReactElement } from "react";
import { SceneViewModel } from "../models/sceneView";
import { SceneExtension } from "./sceneExtension";
import { SceneViewExtension } from "./sceneViewExtension";
import { SceneViewBackgroundProps } from "./sceneViewExtension.types";

export abstract class SceneViewBackgroundExtension extends SceneViewExtension {
    protected constructor(public name: string,
                          public sceneViewModel: SceneViewModel,
                          public sceneExtension: SceneExtension) {
        super(name, sceneViewModel, sceneExtension)
    }

    abstract createBackgroundView(sceneViewBackgroundProps: SceneViewBackgroundProps): ReactElement<SceneViewBackgroundProps>

    abstract handleMouseEvent(e: MouseEvent): boolean
}