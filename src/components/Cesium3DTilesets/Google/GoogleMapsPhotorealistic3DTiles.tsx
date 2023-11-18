import { createGooglePhotorealistic3DTileset } from "cesium";
import { useEffect } from "react";
import { useSceneViewModel } from "../../../providers";
import { GoogleMapsPhotorealistic3DTilesProps } from "./GoogleMapsPhotorealistic3DTiles.types";
import { CesiumSceneViewExtension, ExtensionNames } from "../../../extensions";

export const GoogleMapsPhotorealistic3DTiles = ({key, options}: GoogleMapsPhotorealistic3DTilesProps) => {
    const sceneViewModel = useSceneViewModel()
    const cesiumSceneViewExtension = sceneViewModel.getSceneViewExtension<CesiumSceneViewExtension>(ExtensionNames.Cesium)
    useEffect(() => {
        createGooglePhotorealistic3DTileset(key, options).then((cesium3DTileset) => {
            cesiumSceneViewExtension.addCesium3DTileset(cesium3DTileset)
        })
    }, [key, options])

    return (<></>)
}