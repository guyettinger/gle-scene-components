import { useSceneViewModel } from "../../providers";
import { ThreeViewProps } from "./ThreeView.types";
import { ExtensionNames, ThreeSceneViewExtension } from "../../extensions";

export const ThreeView = ({}: ThreeViewProps) => {
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