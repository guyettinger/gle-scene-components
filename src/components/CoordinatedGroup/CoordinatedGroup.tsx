import { useRef, useState } from "react";
import { Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { Cartesian3, Ellipsoid, Matrix4, Transforms } from "cesium";
import { CoordinatedGroupProps } from "./CoordinatedGroup.types";
import { useSceneViewModel } from "../../providers";

export const CoordinatedGroup = ({coordinates, children, ...groupProps}: CoordinatedGroupProps) => {
    const sceneViewModel = useSceneViewModel()
    const sceneModel = sceneViewModel.sceneModel
    const groupReference = useRef<Group>(null)
    const [groupCoordinates, setGroupCoordinates] = useState<Vector3|null>(null)

    useFrame(({gl, scene, camera}) => {
        // wait for camera initialization
        if (!sceneViewModel.camerasInitialized) return

        // only when the group coordinates are different then the desired coordinates
        if (!!groupCoordinates && groupCoordinates.equals(coordinates)) return

        syncGroup()

    }, 1)

    const syncGroup = () => {

        // wait for the group
        const group = groupReference.current
        if (!group) return

        // desired coordinates
        const groupCoordinates = new Vector3().copy(coordinates)

        // find the offset between the scene center and the group center
        const sceneCenterCartesian = sceneModel.sceneCenterCartesian
        const groupCenterCartesian = Cartesian3.fromDegrees(groupCoordinates.x, groupCoordinates.y, groupCoordinates.z)
        const offset = Cartesian3.subtract(sceneCenterCartesian, groupCenterCartesian, new Cartesian3());

        // using the East-North-Up transform of the scene center
        const transform = Transforms.eastNorthUpToFixedFrame(sceneCenterCartesian);

        // compute the position at the offset
        const positionEastNorthUp = Matrix4.multiplyByPointAsVector(Matrix4.inverse(transform, new Matrix4()), offset, new Cartesian3());

        // convert the East North Up position to scene coordinates
        const position = new Vector3(-positionEastNorthUp.x, -positionEastNorthUp.z, positionEastNorthUp.y)

        // set the group position
        group.position.copy(position)

        // using the geodetic surface normal for the group's center
        const normal = Ellipsoid.WGS84.geodeticSurfaceNormal(groupCenterCartesian);

        // set the group's up vector in scene coordinates
        group.up.set(normal.x, -normal.z, normal.y)

        // set group coordinates
        setGroupCoordinates(groupCoordinates)
    }

    return (
        <group {...groupProps} ref={groupReference}>
            {children}
        </group>
    )
}