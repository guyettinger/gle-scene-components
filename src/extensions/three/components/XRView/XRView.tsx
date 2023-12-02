import { XR } from "@react-three/xr";
import { XRViewProps } from "./XRView.types";
import { XRScene } from "./XRScene";

export const XRView = ({children, ...xrProps}: XRViewProps) => {
    return (
        <XR {...xrProps}>
            <XRScene>
                {children}
            </XRScene>
        </XR>
    )
}