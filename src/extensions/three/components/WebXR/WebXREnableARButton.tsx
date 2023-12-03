import { ARButton as ReactXRARButton } from "@react-three/xr";
import { WebXREnableARButtonProps } from "./WebXREnableARButton.types";

export const WebXREnableARButton = (arButtonProps:WebXREnableARButtonProps) =>{
    return (
        <ReactXRARButton {...arButtonProps}/>
    )
}