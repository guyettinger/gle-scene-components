import { useFrame, useThree } from "@react-three/fiber";
import { useSceneViewModel, useSceneModel } from "../../providers";

export const ThreeScene = () => {
    const {threeScene} = useSceneModel()
    const sceneViewModel = useSceneViewModel()

    useThree((threeRootState) => {
        sceneViewModel.threeRootState = threeRootState;
    })

    // render loop
    useFrame(({gl, scene, camera}) => {
        // wait for cesium viewer
        const cesiumViewer = sceneViewModel.cesiumViewer;
        if (cesiumViewer) {
            // cesium render
            cesiumViewer.render();

            // three render
            gl.render(scene, camera)
        }
    }, 1)

    return (
        <>
            <ambientLight></ambientLight>
            <pointLight position={[0, 0, 1.1]}/>
            <group>
                {threeScene}
            </group>
        </>
    )
}