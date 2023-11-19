import { useEffect } from "react";
import { Cesium3DTileset } from "cesium";
import { useSceneViewModel } from "../../../../../providers";
import { SceneExtensionNames } from "../../../../sceneExtensionNames";
import { CesiumSceneViewBackgroundExtension } from "../../../cesiumSceneViewBackgroundExtension";
import { Cesium3DTilesProps } from "./Cesium3DTiles.types";

export const Cesium3DTiles = ({url, options}: Cesium3DTilesProps) => {
    const sceneViewModel = useSceneViewModel()
    const cesiumSceneViewExtension = sceneViewModel.getSceneViewExtension<CesiumSceneViewBackgroundExtension>(SceneExtensionNames.Cesium)
    useEffect(() => {
        Cesium3DTileset.fromUrl(url, options).then((cesium3DTileset) => {
            cesiumSceneViewExtension.addCesium3DTileset(cesium3DTileset)
        })
    }, [url, options])

    return (<></>)
}