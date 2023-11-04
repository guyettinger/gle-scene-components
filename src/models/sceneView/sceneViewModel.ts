import { RootState, ThreeEvent } from "@react-three/fiber";
import { MathUtils, OrthographicCamera, PerspectiveCamera, Raycaster, Vector3 } from "three";
import {
    Cartesian2, Cartesian3,
    DebugModelMatrixPrimitive,
    HeadingPitchRange, OrthographicFrustum,
    PerspectiveFrustum,
    Transforms,
    Viewer as CesiumViewer
} from "cesium";
import { CameraControls } from "@react-three/drei";
import {Viewer as GaussianSplatViewer} from "gle-gaussian-splat-3d";
import { SceneModel } from "../scene";
import { normalizeAngle, offsetCartesianPositionBySceneOffset } from "../../services";

export class SceneViewModel {

    // three
    threeInitialized: boolean = false
    threeRootState: RootState | null = null

    // raycaster
    threeRaycasterInitialized: boolean = false
    threeRaycaster: Raycaster | null = null

    // gaussian splat viewer
    gaussianSplatViewerInitialized: boolean = false
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
        // get three state
        const {gl, scene, camera} = state;

        // initialize three
        if (!this.threeInitialized) {
            this.threeInitialized = true
            console.log('three initialized')
        }

        // initialize three raycaster
        if (!this.threeRaycasterInitialized && this.threeRaycaster) {
            this.threeRaycasterInitialized = true
            this.threeRaycaster.params.Points.threshold = 0.01
            console.log('three raycaster initialized')
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
            this.camerasInitialized = true

            // perform initial camera sync
            this.syncCameras()

            console.log('camera controls initialized')
        }

        // render three scene
        gl.render(scene, camera)

        // render gaussian splats
        const gaussianSplatViewer = this.gaussianSplatViewer
        if (gaussianSplatViewer && this.gaussianSplatViewerInitialized) {
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

            // invalidate the scene (re-render) until all cesium tiles have loaded
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

    moveCameraToLongitudeLatitudeHeight = (longitudeLatitudeHeight: Vector3, enableTransitions: boolean = false): Promise<void> => {
        const scenePosition = new Vector3()
        this.sceneModel.getScenePositionForLongitudeLatitudeHeight(longitudeLatitudeHeight, scenePosition)
        return this.moveCameraToScenePosition(scenePosition, enableTransitions)
    }

    moveCameraToCartesian = (scenePositionCartesian: Cartesian3, enableTransitions: boolean = false): Promise<void> => {
        const scenePosition = new Vector3()
        this.sceneModel.getScenePositionForCartesian(scenePositionCartesian, scenePosition)
        return this.moveCameraToScenePosition(scenePosition, enableTransitions)
    }

    moveCameraToScenePosition = (scenePosition: Vector3, enableTransitions: boolean = false): Promise<void> => {
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

    setCameraTargetCartesian = (targetCartesian: Cartesian3, enableTransitions: boolean = false): Promise<void> => {
        let sceneTarget = new Vector3()
        this.sceneModel.getScenePositionForCartesian(targetCartesian, sceneTarget)
        return this.setCameraTarget(sceneTarget, enableTransitions)
    }

    setCameraTarget = (target: Vector3, enableTransitions: boolean = false): Promise<void> => {
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

    setCameraLookAt = (position: Vector3, target: Vector3, enableTransitions: boolean = false): Promise<void> => {
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

    passMouseEvent = (e: MouseEvent) => {
        if (!e) return
        if (!this.cesiumViewer) return;
        this.passMouseEventToCesium(e)
    }

    passMouseEventToCesium = (e: MouseEvent) => {
        if (!e) return

        switch (e.type) {
            case 'click':
                // ignore second click of double click
                if (e.detail > 1) return
                break;
            case 'dblclick':
                this.performDoubleClickOnCesium(e)
                break;
        }
    }

    performDoubleClickOnCesium = (e: MouseEvent) => {
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
        this.setCameraTargetCartesian(intersectionCartesian)
    }

    performDoubleClickOnPointCloud = (e: ThreeEvent<MouseEvent>) => {
        if (!e) return
        const intersection = e.point
        if (!intersection) return
        console.log('point cloud intersection', intersection)
        this.setCameraTarget(intersection)
    }

    performDoubleClickOnGaussianSplatCloud = (e: ThreeEvent<MouseEvent>) => {
        if (!e) return
        const intersection = e.point
        if (!intersection) return
        console.log('gaussian splat cloud intersection', e, intersection)
        this.setCameraTarget(intersection)
    }

}