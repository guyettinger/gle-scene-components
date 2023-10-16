import { useFrame, useThree } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { MathUtils, OrthographicCamera, PerspectiveCamera, Vector3 } from "three";
import { Cartesian3, OrthographicFrustum, PerspectiveFrustum } from "cesium";
import { useRef, useState } from "react";
import { useSceneModel, useSceneViewModel } from "../../providers";
import { normalizeAngle, toGeodetic } from "../../services";
import * as Cesium from "cesium";

export const ThreeScene = () => {
    const sceneViewModel = useSceneViewModel()
    const sceneModel = sceneViewModel.sceneModel
    const {threeScene} = useSceneModel()
    const threeCameraControlsReference = useRef<CameraControls>(null)
    const [threeInitialized, setThreeInitialized] = useState<boolean>(false)
    const [cesiumInitialized, setCesiumInitialized] = useState<boolean>(false)
    const [camerasInitialized, setCamerasInitialized] = useState<boolean>(false)

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

            const cameraControls = threeCameraControlsReference?.current;
            if (cameraControls) {
            }

            syncCameras()
            console.log('camera controls initialized')
        }

        // render three scene
        gl.render(scene, camera)

        // render cesium scene
        cesiumViewer.render();

    }, 1)

    const syncCameras = () => {
        // wait for camera controls
        const cameraControls = threeCameraControlsReference.current
        if (!cameraControls) return

        // wait for three camera
        const threeCamera = cameraControls?.camera
        if (!threeCamera) return

        // wait for cesium camera
        const cesiumCamera = sceneViewModel?.cesiumViewer?.camera
        if (!cesiumCamera) return

        // geocentric inverse
        const geocentricInverseMatrixWorld = sceneModel.geocentricInverseMatrixWorld

        // three camera target
        let threeCameraTarget = cameraControls.getTarget(new Vector3())
        let cesiumCameraTarget = new Vector3().copy(threeCameraTarget).applyMatrix4(geocentricInverseMatrixWorld)
        let cesiumCameraTargetGeodetic = toGeodetic(cesiumCameraTarget, new Vector3())
        let cesiumCameraTargetCartesian = Cartesian3.fromDegrees(cesiumCameraTargetGeodetic.x, cesiumCameraTargetGeodetic.y, cesiumCameraTargetGeodetic.z)

        // cesium camera look at
        const transform = Cesium.Transforms.eastNorthUpToFixedFrame(cesiumCameraTargetCartesian)
        const heading = normalizeAngle(-1 * cameraControls.azimuthAngle)
        const pitch = cameraControls.polarAngle - MathUtils.degToRad(90)
        const range = cameraControls.distance

        //todo: translation

        cesiumCamera.lookAtTransform(
            transform,
            new Cesium.HeadingPitchRange(heading, pitch, range)
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
        <group parent={sceneViewModel.sceneModel.geocentricFrame}>
            <ambientLight></ambientLight>
            <pointLight position={[0, 1.1, 0]}/>
            <CameraControls
                ref={threeCameraControlsReference}
                smoothTime={0}
                draggingSmoothTime={0}
                onChange={handleCameraControlsChange}
            />
            {threeScene}
        </group>
    )
}