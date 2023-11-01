import { RootState } from "@react-three/fiber";
import { MathUtils, OrthographicCamera, PerspectiveCamera, Vector3 } from "three";
import {
    DebugModelMatrixPrimitive,
    HeadingPitchRange, OrthographicFrustum,
    PerspectiveFrustum,
    Transforms,
    Viewer as CesiumViewer
} from "cesium";
import { CameraControls } from "@react-three/drei";
import { Viewer as GaussianSplatViewer } from "gle-gs3d"
import { SceneModel } from "../scene";
import { normalizeAngle, offsetCartesianPositionBySceneOffset } from "../../services";

export class SceneViewModel {

    // three
    threeInitialized: boolean = false
    threeRootState: RootState | null = null

    // gaussian splat viewer
    gaussianSplatViewer: GaussianSplatViewer | null = null

    // cesium
    cesiumInitialized: boolean = false
    cesiumViewer: CesiumViewer | null = null
    cesiumLoadingTileCount: number = 0

    // cameras
    camerasInitialized: boolean = false
    cameraControls: CameraControls | null = null

    // debug
    debug: boolean = false
    debugModelMatrixPrimitive: DebugModelMatrixPrimitive | null = null

    constructor(
        public name: string,
        public sceneModel: SceneModel
    ) {
    }

    render = (state: RootState, delta: number) => {
        const {gl, scene, camera} = state;

        // initialize three
        if (!this.threeInitialized) {
            this.threeInitialized = true
            console.log('three initialized')
        }

        // wait for cesium
        const cesiumViewer = this.cesiumViewer
        if (!cesiumViewer) {
            this.invalidate()
            return
        }

        // initialize cesium
        if (!this.cesiumInitialized) {

            // cesium initialized
            this.cesiumInitialized = true;

            // remove axis constraint
            (cesiumViewer.camera as any).constrainedAxis = undefined
            console.log('cesium constrained axis', cesiumViewer.camera.constrainedAxis)

            // allow camera to go below surface
            cesiumViewer.scene.screenSpaceCameraController.enableCollisionDetection = false

            // cesium loading
            cesiumViewer.scene.globe.tileLoadProgressEvent.addEventListener((loadingTileCount) => {
                this.cesiumLoadingTileCount = loadingTileCount
            })

            console.log('cesium initialized')
        }

        // initialize cameras
        if (!this.camerasInitialized) {
            this.syncCameras()
            this.camerasInitialized = true
            console.log('camera controls initialized')
        }

        // render three scene
        gl.render(scene, camera)

        // render gaussian splats
        const gaussianSplatViewer = this.gaussianSplatViewer
        if (gaussianSplatViewer) {
            gaussianSplatViewer.update()
            gaussianSplatViewer.render()
        }

        // render potree
        let potree = this.sceneModel.potree
        let pointClouds = this.sceneModel.pointClouds
        if (pointClouds.length) {
            potree.updatePointClouds(pointClouds, camera, gl)
        }

        // render cesium scene
        cesiumViewer.render()

        // render cesium tiles
        if (this.cesiumLoadingTileCount > 0) {
            this.invalidate()
        }
    }

    invalidate = (frames?: number) => {
        this.threeRootState?.invalidate(frames)
    }

    syncCameras = () => {
        // wait for camera controls
        const cameraControls = this.cameraControls
        if (!cameraControls) return

        // wait for three camera
        const threeCamera = cameraControls?.camera
        if (!threeCamera) return

        // wait for cesium viewer
        const cesiumViewer = this.cesiumViewer
        if (!cesiumViewer) return;

        // wait for cesium camera
        const cesiumCamera = cesiumViewer.camera
        if (!cesiumCamera) return

        // three camera target
        let threeCameraTarget = cameraControls.getTarget(new Vector3())
        let cesiumCameraTargetCartesian = offsetCartesianPositionBySceneOffset(this.sceneModel.sceneCenterCartesian, threeCameraTarget)

        // cesium camera look at
        const transform = Transforms.eastNorthUpToFixedFrame(cesiumCameraTargetCartesian)
        const heading = normalizeAngle(-1 * cameraControls.azimuthAngle)
        const pitch = cameraControls.polarAngle - MathUtils.degToRad(90)
        const range = cameraControls.distance

        // cesium debug axis
        if (this.debug) {
            if (!this.debugModelMatrixPrimitive) {
                this.debugModelMatrixPrimitive = new DebugModelMatrixPrimitive({
                    modelMatrix: transform,
                    length: 5.0,
                })
                cesiumViewer.scene.primitives.add(this.debugModelMatrixPrimitive)
            } else {
                this.debugModelMatrixPrimitive.modelMatrix = transform
            }
        }

        // move cesium camera
        cesiumCamera.lookAtTransform(
            transform,
            new HeadingPitchRange(heading, pitch, range)
        )

        // sync frustum
        if (threeCamera instanceof PerspectiveCamera) {
            if (!(cesiumCamera.frustum instanceof PerspectiveFrustum)) {
                cesiumCamera.switchToPerspectiveFrustum()
            }
        } else {
            if (!(cesiumCamera.frustum instanceof OrthographicFrustum)) {
                cesiumCamera.switchToOrthographicFrustum()
            }
        }

        // sync aspect
        if (threeCamera instanceof PerspectiveCamera) {
            let threeCameraAspect = threeCamera.aspect
            let threeCameraFov = threeCamera.fov
            let perspectiveFrustum = cesiumCamera.frustum as PerspectiveFrustum
            if (threeCameraAspect < 1) {
                perspectiveFrustum.fov = Math.PI * (threeCameraFov / 180)
            } else {
                let cesiumFovY = Math.PI * (threeCameraFov / 180)
                let cesiumFovX = Math.atan(Math.tan(0.5 * cesiumFovY) * threeCameraAspect) * 2
                perspectiveFrustum.fov = cesiumFovX
            }
        } else {
            let orthographicCamera = threeCamera as OrthographicCamera
            let orthographicFrustum = cesiumCamera.frustum as OrthographicFrustum
            orthographicFrustum.aspectRatio = orthographicCamera.right / orthographicCamera.top
            orthographicFrustum.width = (-orthographicCamera.left + orthographicCamera.right) / orthographicCamera.zoom
        }
    }

    moveCameraTo = (longitudeLatitudeHeight: Vector3) => {
        // get current camera target
        const currentTarget = this.cameraControls?.getTarget(new Vector3())
        if (!currentTarget) return

        // get current camera position
        const currentPosition = this.cameraControls?.getPosition(new Vector3())
        if (!currentPosition) return

        // get offset between current camera position and target
        const positionOffset = new Vector3().copy(currentPosition).sub(currentTarget)

        // determine the next camera target
        const nextTarget = new Vector3()
        this.sceneModel.getScenePositionForLongitudeLatitudeHeight(longitudeLatitudeHeight, nextTarget)
        this.cameraControls?.setTarget(nextTarget.x, nextTarget.y, nextTarget.z)

        // determine the next camera position
        const nextPosition = new Vector3().copy(nextTarget).add(positionOffset)
        this.cameraControls?.setPosition(nextPosition.x, nextPosition.y, nextPosition.z)
    }

}