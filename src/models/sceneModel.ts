import { makeAutoObservable } from "mobx";
import { Group, Matrix4, Vector3 } from "three";
import { getOrthotransformForGeocentric, toGeocentric } from "../services";

export class SceneModel {

    geocentricFrame: Group = new Group()
    geocentricMatrix = new Matrix4()
    geocentricInverseMatrix = new Matrix4()
    geocentricMatrixWorld = new Matrix4()
    geocentricInverseMatrixWorld = new Matrix4()

    constructor(
        public name: string,
        public threeScene: JSX.Element,
        public geodeticCenter: Vector3
    ) {
        const geocentricCenter = toGeocentric(geodeticCenter.x, geodeticCenter.y, geodeticCenter.z)
        const orthoTransformForGeocentric = getOrthotransformForGeocentric(geocentricCenter)
        this.geocentricFrame.matrixAutoUpdate = false
        this.geocentricFrame.matrix.copy(orthoTransformForGeocentric)
        this.geocentricMatrix.copy(orthoTransformForGeocentric).invert()
        this.geocentricInverseMatrix.copy(orthoTransformForGeocentric)
        this.geocentricFrame.updateMatrixWorld(true)
        this.geocentricMatrixWorld.copy(this.geocentricFrame.matrixWorld)
        this.geocentricInverseMatrixWorld.copy(this.geocentricFrame.matrixWorld).invert()

        makeAutoObservable(this)
    }
}