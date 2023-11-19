import { Vector3Prop } from "../../types";
import { Vector3 } from "three";

export const convertVector3PropToVector3 = (vector3Prop:Vector3Prop):Vector3 => {
    if(vector3Prop instanceof Vector3) return vector3Prop as Vector3
    return new Vector3().fromArray(vector3Prop)
}