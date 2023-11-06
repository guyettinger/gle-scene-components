import { Canvas } from "@react-three/fiber";
import styled from "styled-components";
import { ThreeScene } from "./ThreeScene";

const ThreeCanvas = styled(Canvas)`
`
export const ThreeView = () => {

    return (
        <ThreeCanvas
            style={{top: 0, bottom: 0, left: 0, right: 0, position: "absolute"}}
            frameloop="demand">
            <ThreeScene/>
        </ThreeCanvas>
    )
}