import { Canvas } from "@react-three/fiber";
import { ThreeScene } from "./ThreeScene";

export const ThreeView = () => {
    return (
        <Canvas style={{top: 0, bottom: 0, left: 0, right: 0, position: "absolute"}}>
            <ThreeScene/>
        </Canvas>
    )
}