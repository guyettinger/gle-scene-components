import proj4 from 'proj4';
import { Matrix4, Plane, Vector3 } from 'three';

function initProj4Defs(): boolean {
    proj4.defs([
        [
            'EPSG:4326',
            '+proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'
        ],
        [
            'EPSG:4269',
            '+proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees'
        ],
        [
            'EPSG:4978',
            '+proj=geocent +datum=WGS84 +units=m +no_defs'
        ]
    ]);
    return true;
}

const init = initProj4Defs();

/**
 * Method used to convert Lat/Lon/Alt data into WGS84 East,North,Elev
 * @param lat Latitude in degrees
 * @param lon Longitude in degrees
 * @param alt Altitude in meters
 * @param target Vector3 ENU
 * @returns Vector3 WGS84 ENU
 */
export function toGeocentric(lat: number, lon: number, alt: number, target = new Vector3()): Vector3 {
    const pRes = proj4('EPSG:4326', 'EPSG:4978', [lon || 0, lat || 0, alt || 0]); // LLA to WGS84 ENU
    target.set(pRes[0], pRes[1], pRes[2]);
    return target;
}

/**
 * Method to convert WGS84 East,North,Elev data to Lat/Lon/Alt
 * @param geocentric Vector3 WGS ENU position
 * @returns Vector3 Lat/Lon/Alt triplet in degrees (Alt in meters)
 */
export function toGeodetic(geocentric: Vector3, target = new Vector3()): Vector3 {
    const pRes = proj4('EPSG:4978', 'EPSG:4326', [geocentric.x, geocentric.y, geocentric.z]); // WGS84 ENU to LLA
    target.set(pRes[1], pRes[0], pRes[2]);
    return target;
}

export function getOrthoAxesForGeocentricTranslation(pos: Vector3): {
    north: Vector3;
    east: Vector3;
    up: Vector3;
} {
    const tangentPlane = new Plane(pos.clone().normalize(), -pos.length());
    const upVec = tangentPlane.normal.clone();

    const northPos = new Vector3(0, 0, pos.z + 10000);
    const northPosOnPlane = new Vector3();
    tangentPlane.projectPoint(northPos, northPosOnPlane);

    const northVec = northPosOnPlane.sub(pos).normalize();
    const eastVec = northVec.clone().cross(upVec);

    return {north: northVec, east: eastVec, up: upVec};
}

// compute an x/y/z -> west/up/north transform for the given ECEF geocentric coordinate
export function getOrthotransformForGeocentric(geocentricPosition: Vector3, target = new Matrix4()): Matrix4 {
    const orthoAxes = getOrthoAxesForGeocentricTranslation(geocentricPosition);
    target.set(
        -orthoAxes.east.x,
        -orthoAxes.east.y,
        -orthoAxes.east.z,
        0,
        orthoAxes.up.x,
        orthoAxes.up.y,
        orthoAxes.up.z,
        0,
        orthoAxes.north.x,
        orthoAxes.north.y,
        orthoAxes.north.z,
        0,
        0,
        0,
        0,
        1
    );
    const rotatedTrans = geocentricPosition.clone().negate().applyMatrix4(target);
    target.setPosition(rotatedTrans);

    return target;
}

/**
 * Converts lat/lon DMS-formatted string (Degrees/Minutes/Seconds) to decimal degrees
 * @param dms
 * @param referenceDirection
 */
export function convertDMSToDD(dms: string, referenceDirection: string | null = null): number {
    let split = dms.split(/\s/);
    if (split.length < 3) return 0;
    let degreesDec = parseFloat(split[0]);
    let sign = Math.sign(degreesDec);
    let minutesDec = (sign * parseFloat(split[1])) / 60;
    let secondsDec = (sign * parseFloat(split[2])) / 3600;
    let dd = degreesDec + minutesDec + secondsDec;

    if (referenceDirection) {
        let dir = referenceDirection.toLowerCase();
        if (dir == 's' || dir == 'w') {
            dd *= -1;
        }
    }
    return dd;
}