import { Vector3 } from 'three';
import { Cartesian3, Ellipsoid, Matrix4 as CesiumMatrix4, Transforms } from "cesium";

export const offsetCartesianPositionByCartesianOffset = (center: Cartesian3, offset: Cartesian3, destination: Cartesian3 = new Cartesian3()): Cartesian3 => {
    const transform = Transforms.eastNorthUpToFixedFrame(center)
    return CesiumMatrix4.multiplyByPoint(transform, offset, destination)
}

export const offsetCartesianPositionBySceneOffset = (center: Cartesian3, offset: Vector3, destination: Cartesian3 = new Cartesian3()): Cartesian3 => {
    return offsetCartesianPositionByCartesianOffset(center, new Cartesian3(offset.x, -offset.z, offset.y), destination)
}

export const getOffsetEastNorthUpCartesian = (centerCartesian: Cartesian3, destinationCartesian: Cartesian3, offsetEastNorthUpCartesian: Cartesian3 = new Cartesian3()) => {
    // find the offset between the center and the destination
    const offset = Cartesian3.subtract(centerCartesian, destinationCartesian, new Cartesian3())

    // using the East-North-Up transform of the center
    const transform = Transforms.eastNorthUpToFixedFrame(centerCartesian);

    // compute the East-North-Up offset from center
    offsetEastNorthUpCartesian = CesiumMatrix4.multiplyByPointAsVector(CesiumMatrix4.inverse(transform, new CesiumMatrix4()), offset, offsetEastNorthUpCartesian);

    return offsetEastNorthUpCartesian
}

export const getScenePositionForLongitudeLatitudeHeight = (sceneCenter: Vector3, sceneCenterCartesian: Cartesian3, longitudeLatitudeHeight: Vector3, scenePosition = new Vector3()): Vector3 => {
    const scenePositionCartesian = Cartesian3.fromDegrees(longitudeLatitudeHeight.x, longitudeLatitudeHeight.y, longitudeLatitudeHeight.z)
    return getScenePositionForCartesian(sceneCenter, sceneCenterCartesian, scenePositionCartesian, scenePosition)
}

export const getScenePositionForCartesian = (sceneCenter: Vector3, sceneCenterCartesian: Cartesian3, scenePositionCartesian: Cartesian3, scenePosition = new Vector3()): Vector3 => {
    const offsetEastNorthUp = getOffsetEastNorthUpCartesian(sceneCenterCartesian, scenePositionCartesian)
    scenePosition.set(
        sceneCenter.x + -offsetEastNorthUp.x,
        sceneCenter.y + -offsetEastNorthUp.z,
        sceneCenter.z + offsetEastNorthUp.y
    )
    return scenePosition
}

export const getSceneSurfaceNormalForLongitudeLatitudeHeight = (longitudeLatitudeHeight: Vector3, sceneSurfaceNormal = new Vector3()): Vector3 => {
    const scenePositionCartesian = Cartesian3.fromDegrees(longitudeLatitudeHeight.x, longitudeLatitudeHeight.y, longitudeLatitudeHeight.z)
    return getSceneSurfaceNormalForCartesian(scenePositionCartesian, sceneSurfaceNormal)
}

export const getSceneSurfaceNormalForCartesian = (scenePositionCartesian: Cartesian3, sceneSurfaceNormal = new Vector3()): Vector3 => {
    const surfaceNormalCartesian = Ellipsoid.WGS84.geodeticSurfaceNormal(scenePositionCartesian)
    sceneSurfaceNormal.set(
        surfaceNormalCartesian.x,
        -surfaceNormalCartesian.z,
        surfaceNormalCartesian.y
    )
    return sceneSurfaceNormal
}

