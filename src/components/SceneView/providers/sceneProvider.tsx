import { createContext, ReactNode, useContext } from "react";
import { SceneModel } from "../models/sceneModel";
import { useStore } from "./storeProvider";

const SceneContext = createContext<SceneModel | null>(null)

export const SceneProvider = (props: { sceneModel: SceneModel, children: ReactNode }) => {
    const {sceneModel, children} = props
    const {sceneStore} = useStore()
    sceneStore.setScene(sceneModel.name, sceneModel)

    return (
        <SceneContext.Provider value={sceneModel}>
            {children}
        </SceneContext.Provider>
    )
}

export const useSceneModel = () => {
    const sceneModel = useContext(SceneContext)
    if (!sceneModel) {
        throw new Error('useSceneModel must be used within a SceneContextProvider.')
    }
    return sceneModel
}