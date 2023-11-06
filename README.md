<a href="/">
    <img alt="logo" src="public/images/logo-flipped.png" align="right" width="120" height="120"/>
</a>

# GLE Scene Components

A React component library for building 3D scenes.

## Supports
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber)
- [Resium](https://github.com/reearth/resium)
- [Potree](https://github.com/guyettinger/gle-potree)
- [Gaussian Splatting](https://github.com/guyettinger/gle-gaussian-splat-3d)

## Documentation
[Storybook](https://guyettinger.github.io/gle-scene-components/)

## Demos
- [Boxes](https://guyettinger.github.io/gle-scene-components/?path=/story/gle-scene-components-sceneview--boxes)
- [Animated Boxes](https://guyettinger.github.io/gle-scene-components/?path=/story/gle-scene-components-sceneview--animated-boxes)
- [Point Clouds](https://guyettinger.github.io/gle-scene-components/?path=/story/gle-scene-components-sceneview--point-clouds)
- [Gaussian Splatting](https://guyettinger.github.io/gle-scene-components/?path=/story/gle-scene-components-sceneview--gaussian-splat-clouds)
- [Coordinated Groups](https://guyettinger.github.io/gle-scene-components/?path=/story/gle-scene-components-sceneview--coordinated-groups)

## Example
![example-screenshot.png](public%2Fimages%2Fexample-screenshot.png)
```tsx
// coordinates
const upperArenaLongitudeLatitudeHeight = new Vector3(-83.765350, 34.401279, 357.0)
const barnParkingLotLongitudeLatitudeHeight = new Vector3(-83.76536188233062, 34.400715493095205, 353.0)
const lowerArenaLongitudeLatitudeHeight = new Vector3(-83.76612684589652, 34.40024525982904, 350.0)

// create a scene
const sceneModel: SceneModel = new SceneModel(
    'Scene1',
    <group>
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
            <GaussianSplatCloud baseUrl="./"
                                fileName="splats/ornament/ornament.splat"
                                position={[0, 1, 0]}
                                rotation={[
                                    MathUtils.degToRad(-30),
                                    MathUtils.degToRad(-45),
                                    MathUtils.degToRad(180), 'ZYX']}
            />
        </CoordinatedGroup>
    </group>,
    upperArenaLongitudeLatitudeHeight
)

// create a view of the scene
const sceneViewModel: SceneViewModel = new SceneViewModel(
    'SceneView1',
    sceneModel
)

export const ExampleScene = () => {
    return (
        <>
            <button
                onClick={() => sceneViewModel.moveCameraToLongitudeLatitudeHeight(upperArenaLongitudeLatitudeHeight)}>
                Upper Arena
            </button>
            <button
                onClick={() => sceneViewModel.moveCameraToLongitudeLatitudeHeight(barnParkingLotLongitudeLatitudeHeight)}>
                Parking
            </button>
            <button
                onClick={() => sceneViewModel.moveCameraToLongitudeLatitudeHeight(lowerArenaLongitudeLatitudeHeight)}>
                Lower Arena
            </button>
            <SceneView sceneViewModel={sceneViewModel}/>
        </>
    )
}
```
[Example Demo](https://guyettinger.github.io/gle-scene-components/?path=/story/gle-scene-components-sceneview--everything)

## Installation
```shell
npm install gle-scene-components@latest
```

## Configuration
### Configure Resium
Follow the [Resium Install Guide ](https://resium.reearth.io/installation)

### Configure Cross-origin Isolation
Gaussian Splatting Shared Memory requires [Cross-origin Isolation to be configured](https://web.dev/articles/coop-coep) in deployment.

This can be achieved by setting response headers on your server:
```
response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
response.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
```
... or deploying [coi-serviceworker](https://github.com/gzuidhof/coi-serviceworker) in your webpage:
```html
<script src="coi-serviceworker.js"></script>
```

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