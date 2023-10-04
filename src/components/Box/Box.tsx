import { ThreeElements, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh } from "three";

export const Box = (props: ThreeElements['mesh']) => {
    const meshRef = useRef<Mesh>(null!);
    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(false);
    useFrame((state, delta) => {
        meshRef.current.rotation.x += delta
        meshRef.current.rotation.y += delta
        meshRef.current.rotation.z += delta
    })
    return (
        <mesh  {...props}
               ref={meshRef}
               scale={active ? 1.5 : 1}
               onClick={(event) => setActive(!active)}
               onPointerOver={(event) => setHovered(true)}
               onPointerOut={(event) => setHovered(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}