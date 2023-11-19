import { ReactElement } from "react";
import { SceneContentProps } from "../SceneContent";
import { SceneConfiguration } from "../../models";
import { Vector3Prop } from "../../types";
import { Vector3 } from "three";

export interface SceneProps {
    name: string,
    sceneCenterLongitudeLatitudeHeight: Vector3Prop,
    children: ReactElement<SceneContentProps>,
    sceneConfiguration?: SceneConfiguration
}

export interface SceneInterface {
    moveCameraToLongitudeLatitudeHeight: (longitudeLatitudeHeight: Vector3, enableTransitions?: boolean) => Promise<void>
}