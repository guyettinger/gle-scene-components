import { StoreProvider, SceneProvider, SceneViewProvider } from "../../providers";
import { SceneViewModel } from "../../models";
import { CesiumView } from "../CesiumView";
import { ThreeView } from "../ThreeView";

export const SceneView = (props: { sceneViewModel: SceneViewModel }) => {
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