import { Object } from './object';
import { Unit } from './unit';

export class Product extends Object {
    /**
     * Identificador del producto
     */
    private _id: string;

    /**
     * Descripción del producto
     */
    private _description: string;

    /**
     * Cantidad de unidades tipo caja en stock
     */
    private _boxQuantity: Number;

    /**
     * Cantidad de unidades tipo unidad en stock
     */
    private _unitQuantity: Number;

    /**
     * Cantidad de otro tipo de unidades en stock
     */
    private _otherQuantity: Number;

    /**
     * Precio de venta de unidad tipo caja
     */
    private _boxPrice: Number;

    /**
     * Precio de venta de unidad tipo unidad
     */
    private _unitPrice: Number;

    /**
     * Precio de venta de otro tipo de unidad
     */
    private _otherPrice: Number;

    /**
     * Precio de compra
     */
    private _basePrice: Number;

    /**
     * Unidades del producto en stock
     */
    private _units: Array<Unit>;

    constructor() { super(); }

    public initValues() {
        this._id = '';
        this._description = '';
        this._boxQuantity = 0;
        this._unitQuantity = 0;
        this._otherQuantity = 0;
        this._boxPrice = 0;
        this._unitPrice = 0;
        this._otherPrice = 0;
        this._basePrice = 0;
        this._units = new Array<Unit>();
    }
    
    set id(value: string) { this._id = value; }
    get id(): string { return this._id; }

    set description(value: string) { this._description = value; }
    get description(): string { return this._description; }

    set boxQuantity(value: Number) { this._boxQuantity = value; }
    get boxQuantity(): Number { return this._boxQuantity; }

    set unitQuantity(value: Number) { this._unitQuantity = value; }
    get unitQuantity(): Number { return this._unitQuantity; }

    set otherQuantity(value: Number) { this._otherQuantity = value; }
    get otherQuantity(): Number { return this._otherQuantity; }

    set boxPrice(value: Number) { this._boxPrice = value; }
    get boxPrice(): Number { return this._boxPrice; }

    set unitPrice(value: Number) { this._unitPrice = value; }
    get unitPrice(): Number { return this._unitPrice; }

    set otherPrice(value: Number) { this._otherPrice = value; }
    get otherPrice(): Number { return this._otherPrice; }

    set basePrice(value: Number) { this._basePrice = value; }
    get basePrice(): Number { return this._basePrice; }

    set units(value: Array<Unit>) { this._units = value; }
    get units(): Array<Unit> { return this._units; }
}