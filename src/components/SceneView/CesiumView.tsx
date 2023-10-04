import { CameraFlyTo, CesiumComponentRef, Viewer } from 'resium'
import { Cartesian3, Viewer as CesiumViewer } from "cesium"
import { useSceneViewModel } from "./providers/sceneViewProvider";

/*
    Component Lifecycle
    Resium brings React's component lifecycle to Cesium. The relationship between Cesium elements and React's lifecycle is as follows:

    1. Render: Nothing is rendered, as a cesium element is not initialized yet.
    2. Initialize Cesium element: An Cesium element is initialized, and it is added to its parent if the parent exists.
    3. Re-render: After Cesium element's initialization, children of the component are rendered. DOM never be rendered except root components (Viewer and CesiumWidget).
    4. Update: Changed properties of the Cesium element are updated. If "Cesium read-only properties" are changed, the Cesium element will be reinitialized.
    5. Unmount: The Cesium element is destroyed.
 */
export const CesiumView = () => {
    const sceneViewModel = useSceneViewModel()
    const creditContainer = typeof document !== 'undefined' ? document?.createElement("div") : null!
    const cartesianCenter = Cartesian3.fromDegrees(sceneViewModel.geodeticCenter.x, sceneViewModel.geodeticCenter.y, sceneViewModel.geodeticCenter.z)

    const handleRef = (e: CesiumComponentRef<CesiumViewer> | null) => {
        if (!e) return;
        const cesiumViewer = e.cesiumElement;
        if (!cesiumViewer) return;
        handleCesiumViewer(cesiumViewer);
    }

    const handleCesiumViewer = (cesiumViewer: CesiumViewer) => {
        sceneViewModel.cesiumViewer = cesiumViewer;
    }

    return (
        <Viewer full
                ref={handleRef}
                animation={false}
                creditContainer={creditContainer}
                homeButton={false}
                navigationHelpButton={false}
                terrainProvider={sceneViewModel.cesiumTerrainProviderFactory}
                timeline={false}
                useDefaultRenderLoop={false}
                geocoder={false}
                sceneModePicker={false}
                baseLayerPicker={false}
                fullscreenButton={false}
        >
            <CameraFlyTo destination={cartesianCenter} duration={0}/>
        </Viewer>
    )
}