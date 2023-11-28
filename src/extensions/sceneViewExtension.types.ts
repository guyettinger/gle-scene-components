import { ReactNode } from "react";
import { ShadowsProp, Vector3Prop } from "../types";

export interface SceneViewForegroundProps {
    key?: string
    cameraPosition?: Vector3Prop
    children: ReactNode
    shadows?: ShadowsProp
}

export interface SceneViewBackgroundProps {
    key?: string
}