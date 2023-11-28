import { CanvasProps, GroupProps, SceneProps, Vector3 } from "@react-three/fiber";
import { SceneViewForegroundProps } from "../../../sceneViewExtension.types";

export interface ThreeViewProps extends SceneViewForegroundProps, CanvasProps {
}

export interface ThreeSceneProps extends SceneProps {
    cameraPosition?: Vector3
}

export interface ThreeSceneGroupProps extends GroupProps {
}