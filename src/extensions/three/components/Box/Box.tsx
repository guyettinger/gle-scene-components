import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh } from "three";
import { useSceneViewModel } from "../../../../providers";
import { BoxProps } from "./Box.types";

export const Box = ({animate, ...meshProps}: BoxProps) => {
    const meshRef = useRef<Mesh>(null!);
    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(false);
    const sceneViewModel = useSceneViewModel()
    useFrame((state, delta) => {
        if(!animate) return
        meshRef.current.rotation.y += delta
        sceneViewModel.invalidate()
    })
    return (
        <mesh  {...meshProps}
               ref={meshRef}
               scale={active ? 1.5 : 1}
               onClick={(event) => setActive(!active)}
               onPointerOver={(event) => setHovered(true)}
               onPointerOut={(event) => setHovered(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
            <pointLight position={[1.1, 1.1, 1.1]}/>
        </mesh>
    )
}