import { makeAutoObservable } from "mobx";
import { Vector3 } from "three";
import { Cartesian3, Ellipsoid } from "cesium";

export class SceneModel {

    sceneCenterCartesian: Cartesian3 = new Cartesian3()

    constructor(
        public name: string,
        public threeScene: JSX.Element,
        public geodeticCenter: Vector3
    ) {
        Cartesian3.fromDegrees(geodeticCenter.x, geodeticCenter.y, geodeticCenter.z, Ellipsoid.WGS84, this.sceneCenterCartesian)
        makeAutoObservable(this)
    }
}