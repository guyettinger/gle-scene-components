import { CanvasProps, GroupProps, SceneProps } from "@react-three/fiber";
import { SceneViewForegroundProps } from "../../../sceneViewExtension.types";

export interface ThreeViewProps extends CanvasProps, SceneViewForegroundProps {
}

export interface ThreeSceneProps extends SceneProps {
}

export interface ThreeSceneGroupProps extends GroupProps {
}