import { createGooglePhotorealistic3DTileset } from 'cesium';
import { useEffect } from 'react';
import { useSceneViewModel } from '../../../../../providers';
import { SceneExtensionNames } from '../../../../sceneExtensionNames';
import { CesiumSceneViewBackgroundExtension } from '../../../cesiumSceneViewBackgroundExtension';
import { GoogleMapsPhotorealistic3DTilesProps } from './GoogleMapsPhotorealistic3DTiles.types';

export const GoogleMapsPhotorealistic3DTiles = ({
  key,
  options,
}: GoogleMapsPhotorealistic3DTilesProps) => {
  const sceneViewModel = useSceneViewModel();
  const cesiumSceneViewExtension =
    sceneViewModel.getSceneViewExtension<CesiumSceneViewBackgroundExtension>(
      SceneExtensionNames.Cesium
    );
  useEffect(() => {
    createGooglePhotorealistic3DTileset(key, options).then((cesium3DTileset) => {
      cesiumSceneViewExtension.addCesium3DTileset(cesium3DTileset);
    });
  }, [key, options]);

  return <></>;
};
