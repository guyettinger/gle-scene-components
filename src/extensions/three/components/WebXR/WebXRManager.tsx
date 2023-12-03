import { XR } from "@react-three/xr";
import { WebXRManagerProps } from "./WebXRManager.types";
import { WebXRScene } from "./WebXRScene";

export const WebXRManager = ({children, ...xrProps}: WebXRManagerProps) => {
    return (
        <XR {...xrProps}>
            <WebXRScene>
                {children}
            </WebXRScene>
        </XR>
    )
}