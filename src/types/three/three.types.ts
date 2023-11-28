import { Vector3 as R3FVector3 } from "@react-three/fiber";
import { WebGLShadowMap } from "three";

export type Vector3Prop = R3FVector3

export type ShadowsProp = boolean | 'basic' | 'percentage' | 'soft' | 'variance' | Partial<WebGLShadowMap>