import { Object } from './object';

export class Dimension extends Object {
    /**
     * Identificador de la dimensión
     */
    private _id: number;

    /**
     * Cantidad de sobres
     */
    private _others: number;

    /**
     * Cantidad de units
     */
    private _units: number;

    constructor() { super(); }

    public initValues(): void {
        this._id = null;
        this._others = null;
        this._units = null;
    }

    public fromJSON(json: any): Dimension {
        let dim = new Dimension();

        dim.id = json.id;
        dim.others = json.others;
        dim.units = json.units;

        return dim;
    }

    set id(value: number) { this._id = value; }
    get id(): number { return this._id; }

    set others(value: number) { this._others = value; }
    get others(): number { return this._others; }

    set units(value: number) { this._units = value; }
    get units(): number { return this._units; }
}