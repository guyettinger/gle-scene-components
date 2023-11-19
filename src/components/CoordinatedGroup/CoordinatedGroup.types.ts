import { GroupProps } from "@react-three/fiber";
import { Vector3Prop } from "../../types";

export interface CoordinatedGroupProps extends GroupProps {
    longitudeLatitudeHeight: Vector3Prop
}