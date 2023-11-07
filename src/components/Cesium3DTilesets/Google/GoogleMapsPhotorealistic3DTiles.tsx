import { createGooglePhotorealistic3DTileset } from "cesium";
import { useEffect } from "react";
import { useSceneViewModel } from "../../../providers";
import { GoogleMapsPhotorealistic3DTilesProps } from "./GoogleMapsPhotorealistic3DTiles.types";

export const GoogleMapsPhotorealistic3DTiles = ({key, options}: GoogleMapsPhotorealistic3DTilesProps) => {
    const sceneViewModel = useSceneViewModel()
    const cesiumSceneViewModel = sceneViewModel.cesiumSceneViewModel
    useEffect(() => {
        createGooglePhotorealistic3DTileset(key, options).then((cesium3DTileset) => {
            cesiumSceneViewModel.addCesium3DTileset(cesium3DTileset)
        })
    }, [key, options])

    return(<></>)
}