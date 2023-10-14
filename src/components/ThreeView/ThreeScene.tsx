import { useFrame, useThree } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { Group, OrthographicCamera, PerspectiveCamera, Vector3 } from "three";
import { Cartesian3, OrthographicFrustum, PerspectiveFrustum } from "cesium";
import { useRef, useState } from "react";
import { useSceneModel, useSceneViewModel } from "../../providers";
import { toGeodetic } from "../../services";

export const ThreeScene = () => {
    const {threeScene} = useSceneModel()
    const sceneViewModel = useSceneViewModel()
    const groupReference = useRef<Group>(null);
    const cameraControlsReference = useRef<CameraControls>(null)

    const [threeInitialized, setThreeInitialized] = useState<boolean>(false)
    const [cesiumInitialized, setCesiumInitialized] = useState<boolean>(false)

    useThree((threeRootState) => {
        sceneViewModel.threeRootState = threeRootState;
    })

    // render loop
    useFrame(({gl, scene, camera}) => {
        // wait for cesium viewer
        const cesiumViewer = sceneViewModel.cesiumViewer;
        const cameraControls = cameraControlsReference.current;

        // geocentric inverse
        const geocentricInverseMatrixWorld = sceneViewModel.sceneModel.geocentricInverseMatrixWorld;

        if (cameraControls) {

            // initialize three
            if (!threeInitialized) {
                setThreeInitialized(true)
                console.log('three initialized')
            }

            // three camera position
            let threeCameraPosition = cameraControls.getPosition(new Vector3(), true)

            // three camera target
            let threeCameraTarget = cameraControls.getTarget(new Vector3(), true)

            // three camera up
            let threeCameraUp = new Vector3().copy(cameraControls.camera.up)

            // three camera direction
            let threeCameraDirection = new Vector3().copy(threeCameraTarget).sub(threeCameraPosition).normalize()

            // render three scene
            gl.render(scene, camera)

            // cesium
            if (cesiumViewer) {

                // initialize cesium
                if (!cesiumInitialized) {
                    setCesiumInitialized(true);
                    cesiumViewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
                    (cesiumViewer.camera as any).constrainedAxis = undefined
                    console.log('cesium constrained axis', cesiumViewer.camera.constrainedAxis)
                    console.log('cesium initialized')
                }

                // cesium camera
                const cesiumCamera = cesiumViewer.camera

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

                console.log('camera position', cesiumCameraPositionGeodetic)
                console.log('camera target', cesiumCameraTargetGeodetic)

                // cesium camera frustum
                if (camera instanceof PerspectiveCamera) {
                    if (!(cesiumCamera.frustum instanceof PerspectiveFrustum)) {
                        cesiumCamera.switchToPerspectiveFrustum();
                    }

                    let aspect = camera.aspect;
                    let perspectiveFrustum = cesiumCamera.frustum as PerspectiveFrustum;
                    if (aspect < 1) {
                        let fovy = Math.PI * (camera.fov / 180);
                        perspectiveFrustum.fov = fovy;
                    } else {
                        let fovy = Math.PI * (camera.fov / 180);
                        let fovx = Math.atan(Math.tan(0.5 * fovy) * aspect) * 2;
                        perspectiveFrustum.fov = fovx;
                    }
                } else {
                    let orthographicCamera = camera as OrthographicCamera;
                    if (!(cesiumCamera.frustum instanceof OrthographicFrustum)) {
                        cesiumCamera.switchToOrthographicFrustum();
                    }
                    let orthographicFrustum = cesiumCamera.frustum as OrthographicFrustum;
                    orthographicFrustum.aspectRatio = orthographicCamera.right / orthographicCamera.top;
                    orthographicFrustum.width = (-orthographicCamera.left + orthographicCamera.right) / orthographicCamera.zoom;
                }

                // todo: handle cesium camera y-up
                // this.cesCameraPosition.x = this.elevationCorrectedPos.x;
                // this.cesCameraPosition.y = this.elevationCorrectedPos.y;
                // this.cesCameraPosition.z = this.elevationCorrectedPos.z;

                // cesiumCamera.up.x = cesiumCameraUpCartesian.x;
                // cesiumCamera.up.y = cesiumCameraUpCartesian.y;
                // cesiumCamera.up.z = cesiumCameraUpCartesian.z;
                //
                // cesiumCamera.direction.x = cesiumCameraDirectionCartesian.x;
                // cesiumCamera.direction.y = cesiumCameraDirectionCartesian.y;
                // cesiumCamera.direction.z = cesiumCameraDirectionCartesian.z;
                //
                // cesiumCamera.position.x = cesiumCameraPositionCartesian.x;
                // cesiumCamera.position.y = cesiumCameraPositionCartesian.y;
                // cesiumCamera.position.z = cesiumCameraPositionCartesian.z;

                cesiumCamera.lookAt(cesiumCameraPositionCartesian, cesiumCameraOffsetCartesian)

                // cesium render
                cesiumViewer.render();

            }
        }
    }, 1)


    return (
        <group parent={sceneViewModel.sceneModel.geocentricFrame} ref={groupReference}>
            <ambientLight></ambientLight>
            <pointLight position={[0, 0, 1.1]}/>
            <CameraControls ref={cameraControlsReference}/>
            {threeScene}
        </group>
    )
}