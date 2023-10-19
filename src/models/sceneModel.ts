import { makeAutoObservable } from "mobx";
import { Vector3 } from "three";
import { Cartesian3, Ellipsoid } from "cesium";
import { PointCloudOctree, Potree } from "gle-three-loader";

export class SceneModel {

    sceneCenterCartesian: Cartesian3 = new Cartesian3()

    // Manages the necessary state for loading/updating one or more point clouds.
    potree = new Potree();

    // List of point clouds which we loaded and need to update.
    pointClouds: PointCloudOctree[] = [];

    constructor(
        public name: string,
        public threeScene: JSX.Element,
        public geodeticCenter: Vector3
    ) {
        Cartesian3.fromDegrees(geodeticCenter.x, geodeticCenter.y, geodeticCenter.z, Ellipsoid.WGS84, this.sceneCenterCartesian)

        // Show at most 2 million points.
        this.potree.pointBudget = 2_000_000;

        makeAutoObservable(this)
    }
}