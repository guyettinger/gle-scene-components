import { RootState, ThreeEvent } from "@react-three/fiber";
import { SceneViewModel } from "../sceneView";
import { SceneModel } from "../scene";

export class PointCloudsSceneViewModel {

    sceneModel: SceneModel

    constructor(
        public name: string,
        public sceneViewModel: SceneViewModel
    ) {
        this.sceneModel = sceneViewModel.sceneModel
    }

    render = (state: RootState, delta: number) => {
        // get three state
        const {gl, scene, camera} = state;

        // render potree
        let potree = this.sceneModel.potree
        let pointClouds = this.sceneModel.pointClouds
        if (pointClouds.length) {
            potree.updatePointClouds(pointClouds, camera, gl)
        }
    }

    performDoubleClick = (e: ThreeEvent<MouseEvent>) => {
        if (!e) return
        const intersection = e.point
        if (!intersection) return
        console.log('point cloud intersection', intersection)
        this.sceneViewModel.setCameraTarget(intersection)
    }
}