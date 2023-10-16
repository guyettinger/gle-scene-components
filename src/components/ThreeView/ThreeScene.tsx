import { useFrame, useThree } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { OrthographicCamera, PerspectiveCamera, Vector3 } from "three";
import { Cartesian3, OrthographicFrustum, PerspectiveFrustum } from "cesium";
import { useRef, useState } from "react";
import { useSceneModel, useSceneViewModel } from "../../providers";
import { toGeodetic } from "../../services";
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
            setCesiumInitialized(true);
            cesiumViewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
            (cesiumViewer.camera as any).constrainedAxis = undefined
            console.log('cesium constrained axis', cesiumViewer.camera.constrainedAxis)
            console.log('cesium initialized')
        }

        // initialize cameras
        if (!camerasInitialized) {
            setCamerasInitialized(true)
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

        // three camera position
        let threeCameraPosition = cameraControls.getPosition(new Vector3())

        // three camera target
        let threeCameraTarget = cameraControls.getTarget(new Vector3())

        // three camera up
        let threeCameraUp = new Vector3().copy(cameraControls.camera.up)

        // three camera direction
        let threeCameraDirection = new Vector3().copy(threeCameraTarget).sub(threeCameraPosition).normalize()

        let cesiumCameraPosition = new Vector3().copy(threeCameraPosition).applyMatrix4(geocentricInverseMatrixWorld)
        let cesiumCameraTarget = new Vector3().copy(threeCameraTarget).applyMatrix4(geocentricInverseMatrixWorld)
        let cesiumCameraDirection = new Vector3().copy(threeCameraDirection).applyMatrix4(geocentricInverseMatrixWorld)
        let cesiumCameraUp = new Vector3().copy(threeCameraUp).transformDirection(geocentricInverseMatrixWorld).normalize()

        let cesiumCameraPositionGeodetic = toGeodetic(cesiumCameraPosition, new Vector3())
        let cesiumCameraTargetGeodetic = toGeodetic(cesiumCameraTarget, new Vector3())
        let cesiumCameraDirectionGeodetic = cesiumCameraPositionGeodetic.clone().sub(cesiumCameraTargetGeodetic)
        let cesiumCameraUpGeodetic = toGeodetic(cesiumCameraUp, new Vector3())

        let cesiumCameraPositionCartesian = Cartesian3.fromDegrees(cesiumCameraPositionGeodetic.x, cesiumCameraPositionGeodetic.y, cesiumCameraPositionGeodetic.z)
        let cesiumCameraTargetCartesian = Cartesian3.fromDegrees(cesiumCameraTargetGeodetic.x, cesiumCameraTargetGeodetic.y, cesiumCameraTargetGeodetic.z)
        let cesiumCameraDirectionCartesian = Cartesian3.fromDegrees(cesiumCameraDirectionGeodetic.x, cesiumCameraDirectionGeodetic.y, cesiumCameraDirectionGeodetic.z)
        let cesiumCameraUpCartesian = Cartesian3.fromDegrees(cesiumCameraUpGeodetic.x, cesiumCameraUpGeodetic.y, cesiumCameraUpGeodetic.z)
        cesiumCameraUpCartesian = Cartesian3.normalize(cesiumCameraUpCartesian, new Cartesian3())

        let cesiumCameraOffsetCartesian = Cartesian3.subtract(cesiumCameraTargetCartesian, cesiumCameraPositionCartesian, new Cartesian3())

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

        const vectorToCartesian = (v:Vector3):Cartesian3 => {
            return new Cartesian3(v.x, v.y, v.z)
        }

        // todo: handle cesium camera y-up
        cesiumCamera.setView({
            destination: cesiumCameraPositionCartesian
        })

        console.log('camera position', cesiumCameraPositionGeodetic)
        console.log('camera target', cesiumCameraTargetGeodetic)
    }

    const handleCameraControlsChange = () => {
        console.log('camera controls change')
        syncCameras();
    }

    return (
        <group parent={sceneViewModel.sceneModel.geocentricFrame}>
            <ambientLight></ambientLight>
            <pointLight position={[0, 0, 1.1]}/>
            <CameraControls onChange={handleCameraControlsChange} ref={threeCameraControlsReference}/>
            {threeScene}
        </group>
    )
}