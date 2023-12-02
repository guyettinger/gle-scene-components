import { VRButton as ReactXRVRButton } from "@react-three/xr";
import { VRButtonProps } from "./VRButton.types";

export const VRButton = (vrButtonProps:VRButtonProps) => {
    return (
        <ReactXRVRButton {...vrButtonProps}/>
    )
}