import { CesiumComponentRef, Viewer } from 'resium'
import { SceneMode, Viewer as CesiumViewer } from "cesium"
import { observer } from "mobx-react";
import { useSceneViewModel } from "../../providers";
import { CesiumViewProps } from "./CesiumView.types";

/*
    Component Lifecycle
    Resium brings React's component lifecycle to Cesium. The relationship between Cesium elements and React's lifecycle is as follows:

    1. Render: Nothing is rendered, as a cesium element is not initialized yet.
    2. Initialize Cesium element: An Cesium element is initialized, and it is added to its parent if the parent exists.
    3. Re-render: After Cesium element's initialization, children of the component are rendered. DOM never be rendered except root components (Viewer and CesiumWidget).
    4. Update: Changed properties of the Cesium element are updated. If "Cesium read-only properties" are changed, the Cesium element will be reinitialized.
    5. Unmount: The Cesium element is destroyed.
 */
export const CesiumView = observer(({}: CesiumViewProps) => {
    const sceneViewModel = useSceneViewModel()
    const cesiumSceneViewModel = sceneViewModel.cesiumSceneViewModel
    const sceneModel = sceneViewModel.sceneModel
    const {cesiumScene} = sceneModel
    const creditContainer = typeof document !== 'undefined' ? document?.createElement("div") : null!

    const handleRef = (e: CesiumComponentRef<CesiumViewer> | null) => {
        if (!e) return;
        const cesiumViewer = e.cesiumElement
        if (!cesiumViewer) return;
        handleCesiumViewer(cesiumViewer)
    }

    const handleCesiumViewer = (cesiumViewer: CesiumViewer) => {
        cesiumSceneViewModel.cesiumViewer = cesiumViewer;
    }

    return (
        <Viewer full
                ref={handleRef}
                animation={false}
                creditContainer={creditContainer}
                homeButton={false}
                navigationHelpButton={false}
                terrainProvider={sceneModel.cesiumTerrainProviderFactory}
                timeline={false}
                useDefaultRenderLoop={false}
                geocoder={false}
                sceneModePicker={false}
                baseLayerPicker={false}
                fullscreenButton={false}
                sceneMode={SceneMode.SCENE3D}
        >
            {cesiumScene}
        </Viewer>
    )
})