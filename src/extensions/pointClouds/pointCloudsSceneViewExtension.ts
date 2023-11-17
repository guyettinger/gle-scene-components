import { RootState, ThreeEvent } from "@react-three/fiber";
import { PointCloudOctree, Potree } from "gle-potree";
import { SceneViewModel } from "../../models/sceneView";
import { SceneViewExtensionModel } from "../../models/sceneViewExtension";
import { PointCloudsSceneExtension } from "./pointCloudsSceneExtension";

export class PointCloudsSceneViewExtension extends SceneViewExtensionModel {

    get potree(): Potree {
        return this.pointCloudsSceneExtension.potree
    }

    get pointClouds(): PointCloudOctree[] {
        return this.pointCloudsSceneExtension.pointClouds
    }

    constructor(
        name: string,
        sceneViewModel: SceneViewModel,
        public pointCloudsSceneExtension: PointCloudsSceneExtension
    ) {
        super(name, sceneViewModel, pointCloudsSceneExtension)
    }

    initialize(state: RootState, delta: number) {
        if (this.initialized) return
        const {raycaster} = state
        if (!raycaster) return
        raycaster.params.Points.threshold = 0.01
        console.log('raycaster initialized')
        this.initialized = true
    }

    render(state: RootState, delta: number) {
        // get three state
        const {gl, scene, camera} = state;

        // render potree
        let potree = this.potree
        let pointClouds = this.pointClouds
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