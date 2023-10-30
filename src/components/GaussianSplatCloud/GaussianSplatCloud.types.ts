import { GroupProps } from "@react-three/fiber";
import { SplatMesh } from "gle-gs3d";

export interface GaussianSplatCloudProps extends GroupProps {
    fileName: string
    baseUrl: string
    onSplatMeshLoad?: (splatMesh: SplatMesh) => void
}
