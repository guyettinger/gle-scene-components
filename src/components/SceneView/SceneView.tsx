import { StoreProvider } from "./providers/storeProvider";
import { SceneViewProvider } from "./providers/sceneViewProvider";
import { CesiumView } from "./CesiumView";
import { ThreeView } from "./ThreeView";
import { SceneProvider } from "./providers/sceneProvider";
import { SceneViewModel } from "./models/sceneViewModel";

const SceneView = (props: { sceneViewModel: SceneViewModel }) => {
    const {sceneViewModel} = props;

    return (
        <StoreProvider>
            <SceneProvider sceneModel={sceneViewModel.sceneModel}>
                <SceneViewProvider sceneViewModel={sceneViewModel}>
                    <CesiumView/>
                    <ThreeView/>
                </SceneViewProvider>
            </SceneProvider>
        </StoreProvider>
    )
}

export default SceneView;