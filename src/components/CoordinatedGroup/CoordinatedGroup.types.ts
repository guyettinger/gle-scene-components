import { GroupProps } from "@react-three/fiber";
import { Vector3 } from "three";

export interface CoordinatedGroupProps extends GroupProps {
    longitudeLatitudeHeight: Vector3
}