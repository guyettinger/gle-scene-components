import { StoreProvider, SceneProvider, SceneViewProvider } from "../../providers";
import styled from "styled-components";
import { SceneViewCanvas } from "./SceneViewCanvas";
import { SceneViewProps } from "./SceneView.types";
import { SceneViewScene } from "./SceneViewScene";
import { CesiumView } from "../CesiumView";
import { ThreeView } from "../ThreeView";

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
                            <SceneViewScene>
                                <ThreeView/>
                            </SceneViewScene>
                        </SceneViewCanvas>
                    </SceneViewProvider>
                </SceneProvider>
            </StoreProvider>
        </SceneViewContent>
    )
}