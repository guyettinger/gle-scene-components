import { SceneContentProps } from "./SceneContent.types";
import { Fragment } from "react";

export const SceneContent = ({children}:SceneContentProps) => {
    return (
        <Fragment>
            {children}
        </Fragment>
    )
}