import { action, makeObservable, observable } from "mobx";
import { Vector3 } from "three";
import { RootState } from "@react-three/fiber";
import {
    Cartesian3,
    DebugModelMatrixPrimitive,
    Ellipsoid,
    Viewer as CesiumViewer
} from "cesium";
import { SceneModel } from "../scene/sceneModel";

export class SceneViewModel {

    // cesium
    cesiumViewer: CesiumViewer | null = null

    // three
    threeRootState: RootState | null = null

    // camera geodetic center
    cameraGeodeticX: number = 0
    cameraGeodeticY: number = 0
    cameraGeodeticZ: number = 0

    updateCameraGeodeticCenter(x: number, y: number, z: number) {
        this.cameraGeodeticX = x
        this.cameraGeodeticY = y
        this.cameraGeodeticZ = z
    }

    private get cameraGeodeticChanged(): boolean {
        return this._cameraGeodeticCenter.x !== this.cameraGeodeticX
            || this._cameraGeodeticCenter.y !== this.cameraGeodeticY
            || this._cameraGeodeticCenter.z !== this.cameraGeodeticZ
    }

    private _cameraGeodeticCenter: Vector3 = new Vector3()
    get cameraGeodeticCenter(): Vector3 {
        if (this.cameraGeodeticChanged) {
            return this._cameraGeodeticCenter.set(this.cameraGeodeticX, this.cameraGeodeticY, this.cameraGeodeticZ)
        }
        return this._cameraGeodeticCenter;
    }

    // cartesian center
    private _cartesianCenter: Cartesian3 = new Cartesian3()

    get cameraCartesianCenter(): Cartesian3 {
        if (this.cameraGeodeticChanged) {
            Cartesian3.fromDegrees(this.cameraGeodeticCenter.x, this.cameraGeodeticCenter.y, this.cameraGeodeticCenter.z, Ellipsoid.WGS84, this._cartesianCenter)
        }
        return this._cartesianCenter;
    }

    constructor(
        public name: string,
        public sceneModel: SceneModel,
        cameraGeodeticCenter: Vector3
    ) {
        this.updateCameraGeodeticCenter(cameraGeodeticCenter.x, cameraGeodeticCenter.y, cameraGeodeticCenter.z)

        makeObservable(this, {
            cameraGeodeticX: observable,
            cameraGeodeticY: observable,
            cameraGeodeticZ: observable,
            updateCameraGeodeticCenter: action
        })
    }

    debugModelMatrixPrimitive:DebugModelMatrixPrimitive | null = null
}