import { createContext, ReactNode, useContext } from "react";
import { useStore } from "../store";
import { SceneViewModel } from "../../models";

export const SceneViewContext = createContext<SceneViewModel | null>(null);

export const SceneViewProvider = (props: { sceneViewModel: SceneViewModel, children: ReactNode }) => {
    const {sceneViewModel, children} = props;
    const {sceneViewStore} = useStore()
    if (!sceneViewStore.hasSceneView(sceneViewModel.name)) {
        sceneViewStore.setSceneView(sceneViewModel.name, sceneViewModel)
    }
    return (
        <SceneViewContext.Provider value={sceneViewModel}>
            {children}
        </SceneViewContext.Provider>
    )
}

export const useSceneViewModel = () => {
    const sceneViewModel = useContext(SceneViewContext);
    if (!sceneViewModel) {
        throw new Error('useSceneViewModel must be used within a SceneViewContextProvider.')
    }
    return sceneViewModel;
}