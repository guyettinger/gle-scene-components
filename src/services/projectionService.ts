import { Vector3 } from 'three';
import { Cartesian3, Matrix4 as CesiumMatrix4, Transforms } from "cesium";

export const offsetCartesian = (center: Cartesian3, offset: Cartesian3, destination: Cartesian3 = new Cartesian3()): Cartesian3 => {
    const transform = Transforms.eastNorthUpToFixedFrame(center)
    return CesiumMatrix4.multiplyByPoint(transform, offset, destination)
}

export const offsetCartesianByVector = (center: Cartesian3, offset: Vector3, destination: Cartesian3 = new Cartesian3()): Cartesian3 => {
    return offsetCartesian(center, new Cartesian3(offset.x, -offset.z, offset.y), destination)
}