import { forwardRef, useImperativeHandle } from "react";
import { Cartesian3 } from "cesium";
import { Vector3 } from "three";
import { SceneInterface, SceneProps } from "./Scene.types";
import { DefaultSceneConfigurationModel, SceneModel, SceneViewModel } from "../../models";
import { SceneView } from "../SceneView";
import { convertVector3PropToVector3 } from "../../services";

export const Scene = forwardRef<SceneInterface, SceneProps>((
    {
        name,
        sceneCenterLongitudeLatitudeHeight,
        children,
        shadows = false,
        sceneConfiguration = new DefaultSceneConfigurationModel()
    }: SceneProps, ref) => {

    const sceneCenterLongitudeLatitudeHeightVector = convertVector3PropToVector3(sceneCenterLongitudeLatitudeHeight)
    const sceneModel = new SceneModel(name, sceneCenterLongitudeLatitudeHeightVector, children, sceneConfiguration)
    const sceneViewModel = new SceneViewModel(name, sceneModel)

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

    return (<SceneView sceneViewModel={sceneViewModel} shadows={shadows}/>)
})