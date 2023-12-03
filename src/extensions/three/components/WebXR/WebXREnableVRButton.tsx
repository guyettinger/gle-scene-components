import { VRButton as ReactXRVRButton } from "@react-three/xr";
import { WebXREnableVRButtonProps } from "./WebXREnableVRButton.types";

export const WebXREnableVRButton = (vrButtonProps:WebXREnableVRButtonProps) => {
    return (
        <ReactXRVRButton {...vrButtonProps}/>
    )
}