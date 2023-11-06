import { RootState } from "@react-three/fiber";
import { MathUtils, OrthographicCamera, PerspectiveCamera, Vector3 } from "three";
import {
    Cartesian2,
    DebugModelMatrixPrimitive,
    HeadingPitchRange, OrthographicFrustum,
    PerspectiveFrustum,
    Transforms,
    Viewer as CesiumViewer
} from "cesium";
import { CameraControls } from "@react-three/drei";
import { normalizeAngle, offsetCartesianPositionBySceneOffset } from "../../services";
import { SceneViewModel } from "../sceneView";
import { SceneModel } from "../scene";

export class CesiumSceneViewModel {

    // scene model
    sceneModel: SceneModel

    // cesium
    cesiumInitialized: boolean = false
    cesiumViewer: CesiumViewer | null = null
    cesiumLoadingTileCount: number = 0

    // debug
    debug: boolean = false
    debugModelMatrixPrimitive: DebugModelMatrixPrimitive | null = null

    constructor(
        public name: string,
        public sceneViewModel: SceneViewModel
    ) {
        this.sceneModel = sceneViewModel.sceneModel
    }

    render = (state: RootState, delta: number) => {

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

            // perform initial camera sync
            this.sceneViewModel.syncCameras()

            console.log('cesium initialized')
        }

        // render cesium scene
        cesiumViewer.render()

        // render cesium tiles
        if (this.cesiumLoadingTileCount > 0) {

            // invalidate the scene (re-render) until all cesium tiles have loaded
            this.invalidate()
        }
    }

    invalidate = (frames?: number) => {
        this.sceneViewModel?.invalidate(frames)
    }

    syncCameras = (cameraControls: CameraControls) => {

        if (!this.cesiumInitialized) return

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
        let threeCameraTarget = cameraControls.getTarget(new Vector3(), true)
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

    performDoubleClick = (e: MouseEvent) => {
        const cesiumViewer = this.cesiumViewer
        if (!cesiumViewer) return

        const cesiumCamera = cesiumViewer.camera
        if (!cesiumCamera) return

        const cesiumScene = cesiumViewer.scene
        if (!cesiumScene) return

        const globe = cesiumScene?.globe
        if (!globe) return

        const windowCoordinates = new Cartesian2(e.x, e.y)
        const ray = cesiumCamera.getPickRay(windowCoordinates)
        if (!ray) return
        const intersectionCartesian = globe.pick(ray, cesiumScene)

        if (!intersectionCartesian) return
        console.log('cesium intersection', intersectionCartesian)
        this.sceneViewModel.setCameraTargetCartesian(intersectionCartesian)
    }
}