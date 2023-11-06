import { Canvas } from "@react-three/fiber";
import { SceneViewCanvasProps } from "./SceneView.types";

export const SceneViewCanvas = ({children, ...canvasProps}:SceneViewCanvasProps) => {
    return (
        <Canvas style={{top: 0, bottom: 0, left: 0, right: 0, position: "absolute"}} frameloop="demand" {...canvasProps}>
            {children}
        </Canvas>
    )
}