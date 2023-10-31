import { PointCloudOctree } from "gle-potree";

export const rotatePointCloudOctreeYUp = (pco: PointCloudOctree) => {
    // translate the point cloud
    pco.translateX(pco.pcoGeometry.offset.x)
    pco.translateY(-pco.pcoGeometry.offset.y)

    // rotate the point cloud
    pco.rotateX(-Math.PI / 2)
}