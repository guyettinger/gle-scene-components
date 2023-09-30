import { makeAutoObservable } from "mobx";

export class SceneModel {

    name: string = ''
    threeScene: JSX.Element | null = null

    constructor() {
        makeAutoObservable(this)
    }
}