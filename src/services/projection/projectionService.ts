import { Vector3 } from 'three';
import { Cartesian3, Matrix4 as CesiumMatrix4, Transforms } from "cesium";

export const offsetCartesian = (center: Cartesian3, offset: Cartesian3, destination: Cartesian3 = new Cartesian3()): Cartesian3 => {
    const transform = Transforms.eastNorthUpToFixedFrame(center)
    return CesiumMatrix4.multiplyByPoint(transform, offset, destination)
}

export const offsetCartesianByVector = (center: Cartesian3, offset: Vector3, destination: Cartesian3 = new Cartesian3()): Cartesian3 => {
    return offsetCartesian(center, new Cartesian3(offset.x, -offset.z, offset.y), destination)
}

export const getEastNorthUpOffset = (centerCartesian:Cartesian3, destinationCartesian:Cartesian3, offsetEastNorthUpCartesian:Cartesian3 = new Cartesian3()) => {
    // find the offset between the center and the destination
    const offset = Cartesian3.subtract(centerCartesian, destinationCartesian, new Cartesian3())

    // using the East-North-Up transform of the center
    const transform = Transforms.eastNorthUpToFixedFrame(centerCartesian);

    // compute the East-North-Up offset from center
    offsetEastNorthUpCartesian = CesiumMatrix4.multiplyByPointAsVector(CesiumMatrix4.inverse(transform, new CesiumMatrix4()), offset, offsetEastNorthUpCartesian);

    return offsetEastNorthUpCartesian
}

