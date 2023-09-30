import { StoreProvider } from "./providers/storeProvider";
import { SceneViewProvider } from "./providers/sceneViewProvider";
import { CesiumView } from "./CesiumView";
import { ThreeView } from "./ThreeView";
import { SceneModel } from "./models/sceneModel";
import { SceneProvider } from "./providers/sceneProvider";

const SceneView = (props: { sceneModel: SceneModel, sceneViewName: string}) => {
    const {sceneModel, sceneViewName} = props;

    return (
        <StoreProvider>
            <SceneProvider sceneModel={sceneModel}>
                <SceneViewProvider sceneViewName={sceneViewName}>
                    <CesiumView/>
                    <ThreeView/>
                </SceneViewProvider>
            </SceneProvider>
        </StoreProvider>
    )
}

export default SceneView;