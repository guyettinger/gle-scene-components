import { StoreProvider, SceneProvider, SceneViewProvider } from "../../providers";
import styled from "styled-components";
import { CesiumView } from "../CesiumView";
import { ThreeView } from "../ThreeView";
import { SceneViewProps } from "./SceneView.types";

const SceneViewContent = styled.div`
`
export const SceneView = ({sceneViewModel, ...divProps}: SceneViewProps) => {
    return (
        <SceneViewContent className='gle-scene-view' {...divProps} >
            <StoreProvider>
                <SceneProvider sceneModel={sceneViewModel.sceneModel}>
                    <SceneViewProvider sceneViewModel={sceneViewModel}>
                        <CesiumView/>
                        <ThreeView/>
                    </SceneViewProvider>
                </SceneProvider>
            </StoreProvider>
        </SceneViewContent>
    )
}