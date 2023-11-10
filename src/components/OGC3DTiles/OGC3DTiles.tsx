import { useRef, useState } from "react";
import { Group } from "three";
import { GroupProps, ThreeEvent, useFrame } from "@react-three/fiber";
import { OGC3DTile } from "gle-threedtiles";
import { useSceneViewModel } from "../../providers";
import { OGC3DTilesProps } from "./OGC3DTiles.types";

export const OGC3DTiles = (ogc3DTilesProps: OGC3DTilesProps) => {
    const sceneViewModel = useSceneViewModel()
    const ogc3DTilesSceneViewModel = sceneViewModel.ogc3DTilesSceneViewModel
    const [initialized, setInitialized] = useState(false)
    const groupReference = useRef<Group>(null)
    const groupProps = ogc3DTilesProps as GroupProps

    useFrame(({gl, scene, camera}) => {
        const group = groupReference.current
        if (!group) return

        if (!initialized) {
            setInitialized(true)

            let properties = Object.assign({}, ogc3DTilesProps)
            if (!properties.renderer) {
                properties.renderer = gl
            }

            const ogc3DTile = new OGC3DTile(properties)
            ogc3DTilesSceneViewModel.addOGC3DTile(ogc3DTile)
            group.add(ogc3DTile)
        }

    }, 1)


    const handleDoubleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        sceneViewModel.ogc3DTilesSceneViewModel.performDoubleClick(e)
    }

    return (
        <group ref={groupReference}
               onDoubleClick={handleDoubleClick}
               {...groupProps}>
        </group>
    )
}