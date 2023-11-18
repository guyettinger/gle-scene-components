import { Fragment } from "react";
import { CesiumSceneContentProps } from "./CesiumSceneContent.types";

export const CesiumSceneContent = ({children}: CesiumSceneContentProps) => {
    return (
        <Fragment>
            {children}
        </Fragment>
    )
}