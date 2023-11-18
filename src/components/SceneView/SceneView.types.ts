import { HTMLAttributes } from "react";
import { SceneViewModel } from "../../models";

export interface SceneViewProps extends HTMLAttributes<HTMLDivElement> {
    sceneViewModel: SceneViewModel
}