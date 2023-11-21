import { ReactElement } from "react";
import { SceneContentProps } from "../SceneContent";
import { SceneConfiguration } from "../../models";
import { Vector3Prop } from "../../types";
import { Vector3 } from "three";
import { Cartesian3 } from "cesium";

export interface SceneProps {
    name: string,
    sceneCenterLongitudeLatitudeHeight: Vector3Prop
    children: ReactElement<SceneContentProps>
    shadows?: boolean
    sceneConfiguration?: SceneConfiguration
}

export interface SceneInterface {
    moveCameraToLongitudeLatitudeHeight: (longitudeLatitudeHeight: Vector3, enableTransitions?: boolean) => Promise<void>
    moveCameraToCartesian: (scenePositionCartesian: Cartesian3, enableTransitions?: boolean) => Promise<void>
    moveCameraToScenePosition: (scenePosition: Vector3, enableTransitions?: boolean) => Promise<void>
    setCameraTargetCartesian: (targetCartesian: Cartesian3, enableTransitions?: boolean) => Promise<void>
    setCameraTarget: (target: Vector3, enableTransitions?: boolean) => Promise<void>
    setCameraLookAt: (position: Vector3, target: Vector3, enableTransitions?: boolean) => Promise<void>
}