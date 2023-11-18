import { ReactElement } from "react";
import { SceneViewExtensionModel } from "./sceneViewExtensionModel";
import { SceneViewModel } from "../sceneView";
import { SceneExtensionModel } from "../sceneExtension";
import { SceneViewBackgroundProps } from "./sceneViewExtension.types";

export abstract class SceneViewBackgroundExtension extends SceneViewExtensionModel {
    protected constructor(public name: string,
                          public sceneViewModel: SceneViewModel,
                          public sceneExtensionModel: SceneExtensionModel) {
        super(name, sceneViewModel, sceneExtensionModel)
    }

    abstract createBackgroundView(sceneViewBackgroundProps: SceneViewBackgroundProps): ReactElement<SceneViewBackgroundProps>

    abstract handleMouseEvent(e: MouseEvent): boolean
}