import { GroupProps } from "@react-three/fiber";
import { PointCloudOctree } from "gle-potree";

export interface PointCloudProps extends GroupProps {
    fileName: string
    baseUrl: string
    onPointCloudLoad?: (pco:PointCloudOctree) => void
}
