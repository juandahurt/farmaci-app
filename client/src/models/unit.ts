import { Object } from './object';

export class Unit extends Object {
    /**
     * Tipos de unidades
     */
    public static UnitType = {
        BOX: 'Caja',
        UNIT: 'Unidad',
        OTHER: 'Sobre'
    }

    /**
     * Identificador de la unidad
     */
    private _id: number;

    /**
     * Cantidad de cajas
     */
    private _boxes: number;

    /**
     * Cantidad de sobres
     */
    private _others: number;

    /**
     * Cantidad de unidades
     */
    private _units: number;

    /**
     * Lote
     */
    private _lot: string;

    /**
     * Fecha en la que fue registrada la unidad
     */
    private _createdAt: Date;

    /**
     * Fecha de vencimiento
     */
    private _expiresAt: Date;

    public initValues(): void {
        this._id = -1;
        this._boxes = null;
        this._others = null;
        this._units = null;
        this._lot = null;
        this._createdAt = null;
        this._expiresAt = null;
    }

    public fromJSON(json: any): Unit {
        let u = new Unit();
  
        u.id = json.id;
        u.boxes = json.boxes;
        u.others = json.others;
        u.units = json.units;
        u.lot = json.lot;
        u.expiresAt = json.expires_at;
        u.createdAt = json.createdAt;
  
        return u;
    }

    get id() { return this._id; }
    set id(value: number) { this._id = value; }

    get boxes() { return this._boxes; }
    set boxes(value: number) { this._boxes = value; }

    get others() { return this._others; }
    set others(value: number) { this._others = value; }

    get units() { return this._units; }
    set units(value: number) { this._units = value; }

    get lot() { return this._lot; }
    set lot(value: string) { this._lot = value; }

    get expiresAt() { return this._expiresAt; }
    set expiresAt(value: Date) { this._expiresAt = value }

    get createdAt() { return this._createdAt; }
    set createdAt(value: Date) { this._createdAt = value; }
}