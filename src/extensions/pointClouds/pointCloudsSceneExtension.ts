import { PointCloudOctree, Potree } from "gle-potree";
import { SceneModel } from "../../models/scene";
import { SceneViewModel } from "../../models/sceneView";
import { SceneExtension } from "../sceneExtension";
import { PointCloudsSceneViewForegroundLayerExtension } from "./pointCloudsSceneViewForegroundLayerExtension";

export class PointCloudsSceneExtension extends SceneExtension {

    // point clouds
    potree = new Potree()
    pointClouds: PointCloudOctree[] = []

    get pointBudget(): number {
        return this.potree.pointBudget
    }

    set pointBudget(pointBudget: number) {
        this.potree.pointBudget = pointBudget
    }

    constructor(name: string, sceneModel: SceneModel) {
        super(name, sceneModel)

        // initialize point clouds
        this.pointBudget = 2_000_000
    }

    createSceneViewExtension(sceneViewModel: SceneViewModel): PointCloudsSceneViewForegroundLayerExtension {
        return new PointCloudsSceneViewForegroundLayerExtension(this.name, sceneViewModel, this)
    }
}