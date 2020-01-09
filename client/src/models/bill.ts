import { Object } from './object';

export class Bill extends Object {
    /**
     * Identificador de la factura
     */
    private _id: Number;

    /**
     * Fecha en la que fue registrada
     */
    private _createdAt: Date;

    constructor() { super(); }

    public initValues(): void {
        this._id = -1;
        this._createdAt = new Date();
    }

    public fromJSON(json: any): Object {
        throw new Error("Method not implemented.");
    }

    get id() { return this._id; }
    set id(value: Number) { this._id = value; }

    get createdAt() { return this._createdAt; }
    set createdAt(value: Date) { this._createdAt = value; }
}