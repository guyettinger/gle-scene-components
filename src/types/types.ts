import { Vector, Vector3 } from "three";

export declare type VectorLike<VectorClass extends Vector> =
    VectorClass
    | Parameters<VectorClass['set']>
    | Readonly<Parameters<VectorClass['set']>>
    | Parameters<VectorClass['setScalar']>[0];
export declare type Vector3Like = VectorLike<Vector3>;