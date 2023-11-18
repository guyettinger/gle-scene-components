import { useEffect } from "react";
import { Cesium3DTileset } from "cesium";
import { useSceneViewModel } from "../../../providers";
import { Cesium3DTilesProps } from "./Cesium3DTiles.types";
import { CesiumSceneViewExtension, ExtensionNames } from "../../../extensions";

export const Cesium3DTiles = ({url, options}: Cesium3DTilesProps) => {
    const sceneViewModel = useSceneViewModel()
    const cesiumSceneViewExtension = sceneViewModel.getSceneViewExtension<CesiumSceneViewExtension>(ExtensionNames.Cesium)
    useEffect(() => {
        Cesium3DTileset.fromUrl(url, options).then((cesium3DTileset) => {
            cesiumSceneViewExtension.addCesium3DTileset(cesium3DTileset)
        })
    }, [url, options])

    return (<></>)
}