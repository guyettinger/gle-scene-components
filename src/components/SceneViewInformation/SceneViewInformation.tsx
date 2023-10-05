import { observer } from "mobx-react";
import { SceneViewModel } from "../../models";

export const SceneViewInformation = observer(({sceneViewModel}: { sceneViewModel: SceneViewModel }) => {

    return (
        <div>
            <div>
                x:{sceneViewModel.cameraGeodeticCenter.x}
            </div>
            <div>
                y:{sceneViewModel.cameraGeodeticCenter.y}
            </div>
            <div>
                z:{sceneViewModel.cameraGeodeticCenter.z}
            </div>
        </div>
    )
})