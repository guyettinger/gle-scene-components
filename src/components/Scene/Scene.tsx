import { forwardRef, useImperativeHandle } from "react";
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
        sceneConfiguration = new DefaultSceneConfigurationModel()
    }: SceneProps, ref) => {

    const sceneCenterLongitudeLatitudeHeightVector = convertVector3PropToVector3(sceneCenterLongitudeLatitudeHeight)
    const sceneModel = new SceneModel(name, sceneCenterLongitudeLatitudeHeightVector, children, sceneConfiguration)
    const sceneViewModel = new SceneViewModel(name, sceneModel)

    useImperativeHandle(ref, () => ({
        moveCameraToLongitudeLatitudeHeight: (longitudeLatitudeHeight: Vector3, enableTransitions: boolean = false) =>{
            return sceneViewModel.moveCameraToLongitudeLatitudeHeight(longitudeLatitudeHeight, enableTransitions)
        }
    }))

    return (<SceneView sceneViewModel={sceneViewModel}/>)
})