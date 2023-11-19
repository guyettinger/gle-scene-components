import { Vector3 } from "three";
import { Cartesian3 } from "cesium";
import { RootState } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { SceneModel } from "../scene";
import {
    SceneViewExtension,
    SceneViewBackgroundExtension,
    SceneViewForegroundExtension
} from "../../extensions";

export class SceneViewModel {

    // scene
    sceneRootState: RootState | null = null

    // camera controls
    cameraControlsInitialized: boolean = false
    cameraControls: CameraControls | null = null

    // scene view extensions
    sceneViewExtensions: Map<string, SceneViewExtension> = new Map<string, SceneViewExtension>()

    // debug
    debug: boolean = false

    constructor(
        public name: string,
        public sceneModel: SceneModel
    ) {
        // scene view extensions
        this.sceneModel.sceneExtensions.forEach((sceneExtension) => {
            const sceneViewExtension = sceneExtension.createSceneViewExtension(this)
            this.sceneViewExtensions.set(sceneViewExtension.name, sceneViewExtension)
        })
    }

    getSceneViewExtension<T extends SceneViewExtension>(name: string): T {
        return this.sceneViewExtensions.get(name) as T
    }

    getSceneViewForegroundExtensions(): SceneViewForegroundExtension[] {
        const sceneViewForegroundExtensions: SceneViewForegroundExtension[] = []
        this.sceneViewExtensions.forEach((sceneViewExtension) => {
            if (!(sceneViewExtension instanceof SceneViewForegroundExtension)) return
            sceneViewForegroundExtensions.push(sceneViewExtension)
        })
        return sceneViewForegroundExtensions
    }

    getSceneViewBackgroundExtensions(): SceneViewBackgroundExtension[] {
        const sceneViewBackgroundExtensions: SceneViewBackgroundExtension[] = []
        this.sceneViewExtensions.forEach((sceneViewExtension) => {
            if (!(sceneViewExtension instanceof SceneViewBackgroundExtension)) return
            sceneViewBackgroundExtensions.push(sceneViewExtension)
        })
        return sceneViewBackgroundExtensions
    }

    render(state: RootState, delta: number) {
        // get three state
        const {gl, scene, camera} = state;

        // initialize scene view extensions
        this.sceneViewExtensions.forEach((sceneViewExtension) => {
            if (!sceneViewExtension.initialized) {
                sceneViewExtension.initialize(state, delta)
            }
        })

        // initialize cameras
        if (!this.cameraControlsInitialized) {
            this.cameraControlsInitialized = true

            // perform initial camera sync
            this.syncCameras()

            console.log('camera controls initialized')
        }

        // render scene
        gl.render(scene, camera)

        // render scene view extensions
        this.sceneViewExtensions.forEach((sceneViewExtension) => {
            sceneViewExtension.render(state, delta)
        })
    }

    invalidate(frames?: number) {
        this.sceneRootState?.invalidate(frames)
    }

    syncCameras() {
        // wait for camera controls
        const cameraControls = this.cameraControls
        if (!cameraControls) return
        this.sceneViewExtensions.forEach((sceneViewExtension) => {
            sceneViewExtension.syncCameras(cameraControls)
        })
    }

    moveCameraToLongitudeLatitudeHeight(longitudeLatitudeHeight: Vector3, enableTransitions: boolean = false): Promise<void> {
        const scenePosition = new Vector3()
        this.sceneModel.getScenePositionForLongitudeLatitudeHeight(longitudeLatitudeHeight, scenePosition)
        return this.moveCameraToScenePosition(scenePosition, enableTransitions)
    }

    moveCameraToCartesian(scenePositionCartesian: Cartesian3, enableTransitions: boolean = false): Promise<void> {
        const scenePosition = new Vector3()
        this.sceneModel.getScenePositionForCartesian(scenePositionCartesian, scenePosition)
        return this.moveCameraToScenePosition(scenePosition, enableTransitions)
    }

    moveCameraToScenePosition(scenePosition: Vector3, enableTransitions: boolean = false): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            // get current camera target
            const currentTarget = this.cameraControls?.getTarget(new Vector3(), true)
            if (!currentTarget) {
                reject('target is undefined')
                return
            }

            // get current camera position
            const currentPosition = this.cameraControls?.getPosition(new Vector3(), true)
            if (!currentPosition) {
                reject('position is undefined')
                return
            }

            // get offset between current camera position and target
            const positionOffset = new Vector3().copy(currentPosition).sub(currentTarget)

            // determine the next camera position
            const nextPosition = new Vector3().copy(scenePosition).add(positionOffset)

            return this.setCameraLookAt(nextPosition, scenePosition, enableTransitions).then(() => {
                resolve()
            })
        })
    }

    setCameraTargetCartesian(targetCartesian: Cartesian3, enableTransitions: boolean = false): Promise<void> {
        let sceneTarget = new Vector3()
        this.sceneModel.getScenePositionForCartesian(targetCartesian, sceneTarget)
        return this.setCameraTarget(sceneTarget, enableTransitions)
    }

    setCameraTarget(target: Vector3, enableTransitions: boolean = false): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let cameraPosition = this.cameraControls?.getPosition(new Vector3(), true)
            if (!cameraPosition) {
                reject('camera position is undefined')
                return
            }

            return this.setCameraLookAt(cameraPosition, target, enableTransitions).then(() => {
                resolve()
            })
        })
    }

    setCameraLookAt(position: Vector3, target: Vector3, enableTransitions: boolean = false): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let cameraControls = this.cameraControls
            if (!cameraControls) {
                reject('camera controls are null')
                return
            }

            cameraControls.setLookAt(position.x, position.y, position.z, target.x, target.y, target.z, enableTransitions).then(() => {

                // synchronize cameras
                this.syncCameras()

                // invalidate the scene
                this.invalidate()

                resolve()
            })
        })
    }

    passMouseEvent(e: MouseEvent) {
        if (!e) return
        let handled = false
        this.getSceneViewBackgroundExtensions().forEach((sceneViewBackgroundExtension) => {
            if (handled) return
            handled = sceneViewBackgroundExtension.handleMouseEvent(e)
        })
    }
}