import { HTMLAttributes } from "react";
import { SceneViewModel } from "../../models";
import { CanvasProps, SceneProps } from "@react-three/fiber";

export interface SceneViewProps extends HTMLAttributes<HTMLDivElement> {
    sceneViewModel: SceneViewModel
}

export interface SceneViewCanvasProps extends CanvasProps {
}

export interface SceneViewSceneProps extends SceneProps{
}