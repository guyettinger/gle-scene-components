import { Color, Vector3 } from "three";
import { Vector3Prop } from "../../types";

export const convertVector3Prop = (vector3Prop: Vector3Prop): Vector3 => {
    if (Array.isArray(vector3Prop)) {
        return new Vector3().fromArray(vector3Prop)
    }
    if (typeof vector3Prop === 'number') {
        return new Vector3().setFromColor(new Color(vector3Prop))
    }
    return vector3Prop as Vector3
}