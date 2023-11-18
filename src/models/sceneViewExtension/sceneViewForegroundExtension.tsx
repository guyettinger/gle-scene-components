import { ReactElement } from "react";
import { SceneViewExtensionModel } from "./sceneViewExtensionModel";
import { SceneViewModel } from "../sceneView";
import { SceneExtensionModel } from "../sceneExtension";
import { SceneViewForegroundProps } from "./sceneViewExtension.types";

export abstract class SceneViewForegroundExtension extends SceneViewExtensionModel {
    protected constructor(public name: string,
                          public sceneViewModel: SceneViewModel,
                          public sceneExtensionModel: SceneExtensionModel) {
        super(name, sceneViewModel, sceneExtensionModel)
    }

    abstract createForegroundView(sceneViewForegroundProps:SceneViewForegroundProps): ReactElement<SceneViewForegroundProps>
}