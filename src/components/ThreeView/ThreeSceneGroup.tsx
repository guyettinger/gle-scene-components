import { useSceneViewModel } from "../../providers";
import { ThreeSceneGroupProps } from "./ThreeView.types";
import { ExtensionNames, ThreeSceneViewExtension } from "../../extensions";

export const ThreeSceneGroup = ({}: ThreeSceneGroupProps) => {
    const sceneViewModel = useSceneViewModel()
    const threeSceneViewExtension = sceneViewModel.getSceneViewExtension<ThreeSceneViewExtension>(ExtensionNames.Three)
    const {threeScene} = threeSceneViewExtension.threeSceneExtension
    const debug = sceneViewModel.debug

    return (
        <group>
            {threeScene}
            {debug && <axesHelper args={[5]}/>}
        </group>
    )
}