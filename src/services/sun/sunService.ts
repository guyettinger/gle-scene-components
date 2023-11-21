import { Cartesian3, JulianDate, Simon1994PlanetaryPositions, Matrix3 as CesiumMatrix3, Transforms } from "cesium";
import { Vector3 } from "three";
import { getScenePositionForCartesian } from "../projection/projectionService";

export const getScenePositionForSun = (sceneCenter: Vector3, sceneCenterCartesian: Cartesian3, date: Date = new Date()): Vector3 => {
    const time = JulianDate.fromIso8601(date.toISOString());
    const sunPositionInEarthInertialFrame = Simon1994PlanetaryPositions.computeSunPositionInEarthInertialFrame(time)
    const transformMatrix = Transforms.computeTemeToPseudoFixedMatrix(time, new CesiumMatrix3());
    const sunPositionCartesian = CesiumMatrix3.multiplyByVector(transformMatrix, sunPositionInEarthInertialFrame, new Cartesian3());
    return getScenePositionForCartesian(sceneCenter, sceneCenterCartesian, sunPositionCartesian)
}

export const getSceneDirectionForSun = (sceneCenter: Vector3, sceneCenterCartesian: Cartesian3, date: Date = new Date()): Vector3 => {
    const scenePosition = getScenePositionForSun(sceneCenter, sceneCenterCartesian, date)
    const direction = scenePosition.normalize()
    return direction;
}