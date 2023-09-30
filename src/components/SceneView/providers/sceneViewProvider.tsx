import { createContext, ReactNode, useContext } from "react";
import { useStore } from "./storeProvider";
import { SceneViewModel } from "../models/sceneViewModel";

const SceneViewContext = createContext<SceneViewModel | null>(null);

export const SceneViewProvider = (props: { sceneViewName: string, children: ReactNode }) => {
    const {sceneViewName, children} = props
    const {sceneViewStore} = useStore()
    const sceneViewModel = sceneViewStore.hasSceneView(sceneViewName)
        ? sceneViewStore.getSceneView(sceneViewName)
        : sceneViewStore.createSceneView(sceneViewName)
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