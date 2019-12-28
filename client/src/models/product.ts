import { Object } from './object';
import { Unit } from './unit';
import { Category } from './category';

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
     * ¿Viene por cajas?
     */
    private _comesInBoxes: boolean;

    /**
     * ¿Viene por unidades?
     */
    private _comesInUnits: boolean;

    /**
     * ¿Viene por otro tipo de unidad?
     */
    private _comesInOthers: boolean;

    /**
     * Categoría del producto
     */
    private _category: Category;

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
        this._comesInBoxes = false;
        this._comesInUnits = false;
        this._comesInOthers = false;
        this._category = new Category();
        this._units = new Array<Unit>();
    }
    
    fromJSON(json: any): Product {
        let p = new Product();

        

        return p;
    }

    set id(value: string) { this._id = value; }
    get id(): string { return this._id; }

    set description(value: string) { this._description = value; }
    get description(): string { return this._description; }

    set comesInBoxes(value: boolean) { this._comesInBoxes = value; }
    get comesInBoxes() { return this._comesInBoxes; }

    set comesInUnits(value: boolean) { this._comesInUnits = value; }
    get comesInUnits() { return this._comesInUnits; }

    set comesInOthers(value: boolean) { this._comesInOthers = value; }
    get comesInOthers() { return this._comesInOthers; }

    set category(value: Category) { this._category = value; }
    get category() { return this._category; }

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