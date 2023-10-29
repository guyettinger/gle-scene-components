import { useFrame, useThree } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { MathUtils, OrthographicCamera, PerspectiveCamera, Vector3 } from "three";
import {
    DebugModelMatrixPrimitive,
    HeadingPitchRange,
    OrthographicFrustum,
    PerspectiveFrustum,
    Transforms
} from "cesium";
import { useRef, useState } from "react";
import { useSceneModel, useSceneViewModel } from "../../providers";
import { normalizeAngle, offsetCartesianByVector } from "../../services";

export const ThreeScene = () => {
    const sceneViewModel = useSceneViewModel()
    const sceneModel = sceneViewModel.sceneModel
    const {threeScene} = useSceneModel()
    const threeCameraControlsReference = useRef<CameraControls>(null)
    const [threeInitialized, setThreeInitialized] = useState<boolean>(false)
    const [cesiumInitialized, setCesiumInitialized] = useState<boolean>(false)
    const [camerasInitialized, setCamerasInitialized] = useState<boolean>(false)
    const [debug, setDebug] = useState<boolean>(true)

    useThree((threeRootState) => {
        sceneViewModel.threeRootState = threeRootState;
    })

    // render loop
    useFrame(({gl, scene, camera}) => {
        // initialize three
        if (!threeInitialized) {
            setThreeInitialized(true)
            console.log('three initialized')
        }

        // wait for cesium
        const cesiumViewer = sceneViewModel.cesiumViewer
        if (!cesiumViewer) return;

        // initialize cesium
        if (!cesiumInitialized) {
            // remove axis constraint
            (cesiumViewer.camera as any).constrainedAxis = undefined
            console.log('cesium constrained axis', cesiumViewer.camera.constrainedAxis)

            // allow camera to go below surface
            cesiumViewer.scene.screenSpaceCameraController.enableCollisionDetection = false

            // cesium initialized
            setCesiumInitialized(true)
            console.log('cesium initialized')
        }

        // initialize cameras
        if (!camerasInitialized) {
            setCamerasInitialized(true)
            syncCameras()
            sceneViewModel.camerasInitialized = true
            console.log('camera controls initialized')
        }

        // render three scene
        gl.render(scene, camera)

        // render gaussian splats
        const gaussianSplatViewer = sceneViewModel.gaussianSplatViewer
        if (gaussianSplatViewer) {
            // gaussianSplatViewer.update()
            // gaussianSplatViewer.render()
        }

        // render point cloud
        sceneModel.potree.updatePointClouds(sceneModel.pointClouds, camera, gl)

        // render cesium scene
        cesiumViewer.render()

    }, 1)

    const syncCameras = () => {
        // wait for camera controls
        const cameraControls = threeCameraControlsReference.current
        if (!cameraControls) return

        // wait for three camera
        const threeCamera = cameraControls?.camera
        if (!threeCamera) return

        // wait for cesium viewer
        const cesiumViewer = sceneViewModel.cesiumViewer
        if (!cesiumViewer) return;

        // wait for cesium camera
        const cesiumCamera = cesiumViewer.camera
        if (!cesiumCamera) return

        // three camera target
        let threeCameraTarget = cameraControls.getTarget(new Vector3())
        let cesiumCameraTargetCartesian = offsetCartesianByVector(sceneModel.sceneCenterCartesian, threeCameraTarget)

        // cesium camera look at
        const transform = Transforms.eastNorthUpToFixedFrame(cesiumCameraTargetCartesian)
        const heading = normalizeAngle(-1 * cameraControls.azimuthAngle)
        const pitch = cameraControls.polarAngle - MathUtils.degToRad(90)
        const range = cameraControls.distance

        if (debug) {
            // cesium debug axis
            if (!sceneViewModel.debugModelMatrixPrimitive) {
                sceneViewModel.debugModelMatrixPrimitive = new DebugModelMatrixPrimitive({
                    modelMatrix: transform,
                    length: 5.0,
                })
                cesiumViewer.scene.primitives.add(sceneViewModel.debugModelMatrixPrimitive)
            } else {
                sceneViewModel.debugModelMatrixPrimitive.modelMatrix = transform
            }
        }

        cesiumCamera.lookAtTransform(
            transform,
            new HeadingPitchRange(heading, pitch, range)
        )

        // cesium camera frustum
        if (threeCamera instanceof PerspectiveCamera) {
            if (!(cesiumCamera.frustum instanceof PerspectiveFrustum)) {
                cesiumCamera.switchToPerspectiveFrustum();
            }

            let aspect = threeCamera.aspect;
            let perspectiveFrustum = cesiumCamera.frustum as PerspectiveFrustum;
            if (aspect < 1) {
                let fovy = Math.PI * (threeCamera.fov / 180);
                perspectiveFrustum.fov = fovy;
            } else {
                let fovy = Math.PI * (threeCamera.fov / 180);
                let fovx = Math.atan(Math.tan(0.5 * fovy) * aspect) * 2;
                perspectiveFrustum.fov = fovx;
            }
        } else {
            let orthographicCamera = threeCamera as OrthographicCamera;
            if (!(cesiumCamera.frustum instanceof OrthographicFrustum)) {
                cesiumCamera.switchToOrthographicFrustum();
            }
            let orthographicFrustum = cesiumCamera.frustum as OrthographicFrustum;
            orthographicFrustum.aspectRatio = orthographicCamera.right / orthographicCamera.top;
            orthographicFrustum.width = (-orthographicCamera.left + orthographicCamera.right) / orthographicCamera.zoom;
        }
    }

    const handleCameraControlsChange = () => {
        syncCameras();
    }

    return (
        <scene>
            <ambientLight></ambientLight>
            <CameraControls
                ref={threeCameraControlsReference}
                smoothTime={0}
                draggingSmoothTime={0}
                onChange={handleCameraControlsChange}
            />
            <group>
                {threeScene}
                {debug && <axesHelper args={[5]}/>}
            </group>
        </scene>
    )
}