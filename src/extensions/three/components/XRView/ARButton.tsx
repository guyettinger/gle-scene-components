import { ARButton as ReactXRARButton } from "@react-three/xr";
import { ARButtonProps } from "./ARButton.types";

export const ARButton = (arButtonProps:ARButtonProps) =>{
    return (
        <ReactXRARButton {...arButtonProps}/>
    )
}