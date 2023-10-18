import { MathUtils } from "three";

const TAU = Math.PI * 2;

export const normalizeAngle = (angle: number) => {
    return MathUtils.euclideanModulo(angle, TAU);
}
