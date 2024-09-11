<a href="/">
    <img alt="logo" src="public/images/logo-flipped.png" align="right" width="120" height="120"/>
</a>

# GLE Scene Components
[![Version](https://img.shields.io/npm/v/gle-scene-components?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/gle-scene-components)
[![Downloads](https://img.shields.io/npm/dt/gle-scene-components.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/gle-scene-components)

A React component library for building 3D scenes.

## Installation
```shell
npm install gle-scene-components
```

## Configuration
### Configure Resium
Follow the [Resium Install Guide ](https://resium.reearth.io/installation)

## Supports
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber)
- [Resium](https://github.com/reearth/resium)
- [Potree](https://github.com/guyettinger/gle-potree)
- [Gaussian Splatting](https://github.com/guyettinger/gle-gaussian-splat-3d)
- [Cesium 3D Tiles](https://cesium.com/blog/2023/10/26/photorealistic-3d-tiles-in-cesium-ion/)
- [ThreeJS 3D Tiles](https://github.com/ebeaufay/threedtiles)
- [WebXR](https://github.com/pmndrs/react-xr)

## Documentation
- [Storybook](https://gle-scene-components.vercel.app/)

## Demos
- [Boxes](https://gle-scene-components.vercel.app/?path=/story/gle-scene-components-scene--boxes)
- [Animated Boxes](https://gle-scene-components.vercel.app/?path=/story/gle-scene-components-scene--animated-boxes)
- [Point Clouds](https://gle-scene-components.vercel.app/?path=/story/gle-scene-components-scene--point-clouds)
- [Gaussian Splatting](https://gle-scene-components.vercel.app/?path=/story/gle-scene-components-scene--gaussian-splat-clouds)
- [Coordinated Groups](https://gle-scene-components.vercel.app/?path=/story/gle-scene-components-scene--coordinated-groups)
- [Google Photorealistic 3D Tiles](https://gle-scene-components.vercel.app/?path=/story/gle-scene-components-scene--google-tiles)
- [Mesh 3D Tiles](https://gle-scene-components.vercel.app/?path=/story/gle-scene-components-scene--three-d-tiles)
- [VR](https://gle-scene-components.vercel.app/?path=/story/gle-scene-components-scene--vr)
- [AR](https://gle-scene-components.vercel.app/?path=/story/gle-scene-components-scene--ar)

## Examples

![example-simple-scene.png](public%2Fimages%2Fexample-simple-scene.png)
```tsx
export const ExampleSimpleScene = () => {
    return (
        <Scene name='Simple Scene'
               sceneCenterLongitudeLatitudeHeight={[-83.765350, 34.401279, 357.0]}
               cesiumIonAccessToken={cesiumIonAccessToken}>
            <SceneContent>
                <ThreeSceneContent>
                    <Box position={[4, 0, 0]}/>
                    <Box position={[0, 0, -4]}/>
                    <Box position={[-4, 0, 0]}/>
                </ThreeSceneContent>
            </SceneContent>
        </Scene>
    )
}
```
[Simple Example Demo](https://gle-scene-components.vercel.app/?path=/story/gle-scene-components-scene--boxes)


![example-complex-scene.png](public%2Fimages%2Fexample-complex-scene.png)
```tsx
export const ExampleComplexScene = () => {
    
    // coordinates
    const upperArenaLongitudeLatitudeHeight = new Vector3(-83.765350, 34.401279, 357.0)
    const barnParkingLotLongitudeLatitudeHeight = new Vector3(-83.76536188233062, 34.400715493095205, 353.0)
    const lowerArenaLongitudeLatitudeHeight = new Vector3(-83.76612684589652, 34.40024525982904, 350.0)

    // reference
    const sceneRef = useRef<SceneInterface>(null)
    
    return (
        <>
            <SceneButton
                onClick={() => sceneRef.current?.moveCameraToLongitudeLatitudeHeight(upperArenaLongitudeLatitudeHeight)}>
                Upper Arena
            </SceneButton>
            <SceneButton
                onClick={() => sceneRef.current?.moveCameraToLongitudeLatitudeHeight(barnParkingLotLongitudeLatitudeHeight)}>
                Parking
            </SceneButton>
            <SceneButton
                onClick={() => sceneRef.current?.moveCameraToLongitudeLatitudeHeight(lowerArenaLongitudeLatitudeHeight)}>
                Lower Arena
            </SceneButton>
            <Scene name='Complex Scene'
                   ref={sceneRef}
                   sceneCenterLongitudeLatitudeHeight={upperArenaLongitudeLatitudeHeight}
                   cesiumIonAccessToken={cesiumIonAccessToken}>
                <SceneContent>
                    <ThreeSceneContent>
                        <CoordinatedGroup longitudeLatitudeHeight={upperArenaLongitudeLatitudeHeight}>
                            <PointCloud
                                baseUrl="https://raw.githubusercontent.com/potree/potree/develop/pointclouds/lion_takanawa/"
                                fileName="cloud.js"
                                onPointCloudLoad={rotatePointCloudOctreeYUp}
                                position={[0, -.75, 0]}
                            />
                        </CoordinatedGroup>
                        <CoordinatedGroup longitudeLatitudeHeight={barnParkingLotLongitudeLatitudeHeight}>
                            <Box position={[0, 0, 0]}/>
                        </CoordinatedGroup>
                        <CoordinatedGroup longitudeLatitudeHeight={lowerArenaLongitudeLatitudeHeight}>
                            <group position={[0, 2.60, -15]}
                                   rotation={[MathUtils.degToRad(30), 0, 0, 'XYZ']}>
                                <GaussianSplatCloud baseUrl="./"
                                                    fileName="splats/ornament/ornament.splat"
                                                    rotation={[
                                                        MathUtils.degToRad(-38),
                                                        MathUtils.degToRad(-85),
                                                        MathUtils.degToRad(180), 'ZYX']}
                                />
                            </group>
                            <OGC3DTiles url={"https://storage.googleapis.com/ogc-3d-tiles/museumMeshed/tileset.json"}
                                        position={[0, -2, 0]}
                                        rotation={[
                                            MathUtils.degToRad(0),
                                            MathUtils.degToRad(90),
                                            MathUtils.degToRad(180), 'XYZ'
                                        ]}/>
                        </CoordinatedGroup>
                    </ThreeSceneContent>
                    <CesiumSceneContent>
                        <GoogleMapsPhotorealistic3DTiles/>
                    </CesiumSceneContent>
                </SceneContent>
            </Scene>
        </>
    )
}
```
[Complex Example Demo](https://gle-scene-components.vercel.app/?path=/story/gle-scene-components-scene--everything)

## Development
Install
```
npm install
```
Build Library
```
npm run build
```
Run Tests
```
npm run test
```
Run Storybook
```
npm run storybook
```