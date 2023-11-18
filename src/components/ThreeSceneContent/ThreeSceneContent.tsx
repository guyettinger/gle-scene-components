import { Fragment } from "react";
import { ThreeSceneContentProps } from "./ThreeSceneContent.types";

export const ThreeSceneContent = ({children}: ThreeSceneContentProps) => {
    return (
        <Fragment>
            {children}
        </Fragment>
    )
}