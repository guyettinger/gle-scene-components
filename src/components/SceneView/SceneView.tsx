import { StoreProvider, SceneProvider, SceneViewProvider } from "../../providers";
import styled from "styled-components";
import { CesiumView } from "../CesiumView";
import { SceneViewCanvas } from "./SceneViewCanvas";
import { SceneViewProps } from "./SceneView.types";
import { SceneViewScene } from "./SceneViewScene";

const SceneViewContent = styled.div`
`
export const SceneView = ({sceneViewModel, ...divProps}: SceneViewProps) => {
    return (
        <SceneViewContent className='gle-scene-view' {...divProps} >
            <StoreProvider>
                <SceneProvider sceneModel={sceneViewModel.sceneModel}>
                    <SceneViewProvider sceneViewModel={sceneViewModel}>
                        <CesiumView/>
                        <SceneViewCanvas>
                            <SceneViewScene/>
                        </SceneViewCanvas>
                    </SceneViewProvider>
                </SceneProvider>
            </StoreProvider>
        </SceneViewContent>
    )
}