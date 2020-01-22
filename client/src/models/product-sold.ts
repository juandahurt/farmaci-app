import { Product } from './product';
import { Bill } from './bill';
import { Object } from './object';

export class ProductSold extends Object {
    /**
     * Referencia al Producto que fue vendido
     */
    private _product: Product;

    /**
     * Factura del Product
     */
    private _bill: Bill;

    /**
     * Cantidad vendida
     */
    private _quantity: number;

    /**
     * Subtotal del producto
     */
    private _subtotal: number;

    /**
     * Precio unitario
     */
    private _unitaryPrice: number;

    /**
     * Tipo de Unidad vendida
     */
    private _unitType: string;

    constructor() { super(); }

    public initValues(): void {
        this._product = new Product();
        this._bill = new Bill();
        this._quantity = 1;
        this._subtotal = 0;
        this._unitaryPrice = 0;
        this._unitType = null;
    }

    public fromJSON(json: any): ProductSold {
        let prodSold = new ProductSold();

        return prodSold;
    }

    get product() { return this._product; }
    set product(value: Product) { this._product = value; }

    get bill() { return this._bill; }
    set bill(value: Bill) { this._bill = value; }

    get quantity() { return this._quantity; }
    set quantity(value: number) { this._quantity = value; }

    get subtotal() { return this._subtotal; }
    set subtotal(value: number) { this._subtotal = value; }

    get unitaryPrice() { return this._unitaryPrice; }
    set unitaryPrice(value: number) { this._unitaryPrice = value; }

    get unitType() { return this._unitType; }
    set unitType(value: string) { this._unitType = value; }
}