import { CanvasProps, SceneProps } from "@react-three/fiber";

import { SceneViewForegroundProps } from "../../../../models/sceneViewExtension/sceneViewExtension.types";

export interface ThreeViewProps extends CanvasProps, SceneViewForegroundProps {
}

export interface ThreeSceneProps extends SceneProps {
}

export interface ThreeSceneGroupProps {

}