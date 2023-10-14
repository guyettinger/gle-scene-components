import { Canvas } from "@react-three/fiber";
import { ThreeScene } from "./ThreeScene";
import styled from "styled-components";

const ThreeCanvas = styled(Canvas)`
`
export const ThreeView = () => {
    return (
        <ThreeCanvas style={{top: 0, bottom: 0, left: 0, right: 0, position: "absolute"}}>
            <ThreeScene/>
        </ThreeCanvas>
    )
}