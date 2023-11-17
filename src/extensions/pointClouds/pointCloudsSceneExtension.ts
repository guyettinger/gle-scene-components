import { PointCloudOctree, Potree } from "gle-potree";
import { SceneModel } from "../../models/scene";
import { SceneExtensionModel } from "../../models/sceneExtension";
import { SceneViewModel } from "../../models/sceneView";
import { PointCloudsSceneViewExtension } from "./pointCloudsSceneViewExtension";

export class PointCloudsSceneExtension extends SceneExtensionModel {

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

    createSceneViewExtension(sceneViewModel: SceneViewModel): PointCloudsSceneViewExtension {
        return new PointCloudsSceneViewExtension(this.name, sceneViewModel, this)
    }
}