import { makeAutoObservable } from "mobx";
import { Vector3 } from "three";

export class SceneModel {

    constructor(
        public name: string,
        public threeScene: JSX.Element,
        public geodeticCenter: Vector3
    ) {
        makeAutoObservable(this)
    }
}