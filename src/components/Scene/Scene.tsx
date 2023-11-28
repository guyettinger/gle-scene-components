import { forwardRef, useImperativeHandle } from "react";
import { Cartesian3 } from "cesium";
import { Vector3 } from "three";
import { SceneInterface, SceneProps } from "./Scene.types";
import { SceneModel, SceneViewModel } from "../../models";
import { SceneView } from "../SceneView";

export const Scene = forwardRef<SceneInterface, SceneProps>(
    (sceneProps: SceneProps, ref) => {

        const sceneModel = new SceneModel(sceneProps)
        const sceneViewModel = new SceneViewModel(sceneProps.name, sceneModel)

        useImperativeHandle(ref, () => ({
            moveCameraToLongitudeLatitudeHeight: (longitudeLatitudeHeight: Vector3, enableTransitions: boolean = false) => {
                return sceneViewModel.moveCameraToLongitudeLatitudeHeight(longitudeLatitudeHeight, enableTransitions)
            },
            moveCameraToCartesian: (scenePositionCartesian: Cartesian3, enableTransitions?: boolean) => {
                return sceneViewModel.moveCameraToCartesian(scenePositionCartesian, enableTransitions)
            },
            moveCameraToScenePosition: (scenePosition: Vector3, enableTransitions?: boolean) => {
                return sceneViewModel.moveCameraToScenePosition(scenePosition, enableTransitions)
            },
            setCameraTargetCartesian: (targetCartesian: Cartesian3, enableTransitions?: boolean) => {
                return sceneViewModel.setCameraTargetCartesian(targetCartesian, enableTransitions)
            },
            setCameraTarget: (target: Vector3, enableTransitions?: boolean) => {
                return sceneViewModel.setCameraTarget(target, enableTransitions)
            },
            setCameraLookAt: (position: Vector3, target: Vector3, enableTransitions?: boolean) => {
                return sceneViewModel.setCameraLookAt(position, target, enableTransitions)
            }
        }))

        return (<SceneView {...sceneViewModel.sceneViewProps}/>)
    })