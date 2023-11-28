import { ReactElement } from "react";
import { Vector3 } from "three";
import { Cartesian3 } from "cesium";
import { SceneContentProps } from "../SceneContent";
import { SceneExtensionGenerator } from "../../extensions";
import { Vector3Prop } from "../../types";

export interface SceneProps {
    name: string,
    cameraPosition?: Vector3Prop
    children: ReactElement<SceneContentProps>
    sceneCenterLongitudeLatitudeHeight: Vector3Prop
    sceneExtensionGenerator?: SceneExtensionGenerator
    shadows?: boolean
}

export interface SceneInterface {
    moveCameraToLongitudeLatitudeHeight: (longitudeLatitudeHeight: Vector3, enableTransitions?: boolean) => Promise<void>
    moveCameraToCartesian: (scenePositionCartesian: Cartesian3, enableTransitions?: boolean) => Promise<void>
    moveCameraToScenePosition: (scenePosition: Vector3, enableTransitions?: boolean) => Promise<void>
    setCameraTargetCartesian: (targetCartesian: Cartesian3, enableTransitions?: boolean) => Promise<void>
    setCameraTarget: (target: Vector3, enableTransitions?: boolean) => Promise<void>
    setCameraLookAt: (position: Vector3, target: Vector3, enableTransitions?: boolean) => Promise<void>
}