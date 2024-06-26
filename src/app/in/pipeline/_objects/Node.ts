import { cloneDeep } from "lodash";
import { ControllerData } from "./ControllerData";

export class Node {
    public id: number;
    public data: ControllerData;
    public isSelected: boolean = false;

    public position: { x: number, y: number } = { x: 0, y: 0 };
    public updatedPosition: { x: number, y: number } = { x: 0, y: 0 };
    public icon: string;
    public color: string;
    public name: string;
    public description: string = "";

    constructor(position: { x: number, y: number }) {
        this.position = position;
        this.updatedPosition = cloneDeep(this.position);
    }
}
