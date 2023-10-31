import { useRef, useState } from "react";
import { Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { CoordinatedGroupProps } from "./CoordinatedGroup.types";
import { useSceneViewModel } from "../../providers";

export const CoordinatedGroup = ({longitudeLatitudeHeight, children, ...groupProps}: CoordinatedGroupProps) => {
    const sceneViewModel = useSceneViewModel()
    const sceneModel = sceneViewModel.sceneModel
    const groupReference = useRef<Group>(null)
    const [groupLongitudeLatitudeHeight, setGroupLongitudeLatitudeHeight] = useState<Vector3|null>(null)

    useFrame(({}) => {
        // wait for camera initialization
        if (!sceneViewModel.camerasInitialized) return

        // only when the group coordinates are different then the desired coordinates
        if (!!groupLongitudeLatitudeHeight && groupLongitudeLatitudeHeight.equals(longitudeLatitudeHeight)) return

        syncGroup()

    }, 1)

    const syncGroup = () => {

        // wait for the group
        const group = groupReference.current
        if (!group) return

        // desired coordinates
        const groupLongitudeLatitudeHeight = new Vector3().copy(longitudeLatitudeHeight)

        // set the group's position
        sceneModel.getScenePositionForLongitudeLatitudeHeight(groupLongitudeLatitudeHeight, group.position)

        // set the group's up to the surface normal
        sceneModel.getSceneSurfaceNormalForLongitudeLatitudeHeight(groupLongitudeLatitudeHeight, group.up)

        // save group coordinates
        setGroupLongitudeLatitudeHeight(groupLongitudeLatitudeHeight)
    }

    return (
        <group {...groupProps} ref={groupReference}>
            {children}
        </group>
    )
}