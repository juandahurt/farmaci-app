import { Object } from './object';
import { Provider } from './provider';

export class Expense extends Object {
    /**
     * Identificador del egreso
     */
    private _id: number;

    /**
     * Identificador de la factura
     */
    private _billId: string;

    /**
     * Descripción del egreso
     */
    private _description: string;

    /**
     * Valor del egreso
     */
    private _value: number;

    /**
     * Fecha en que fue registrado
     */
    private _createdAt: Date;

    /**
     * Proveedor
     */
    private _provider: Provider;

    public initValues(): void {
        this._id = -1;
        this._billId = '';
        this._description = '';
        this._createdAt = new Date();
        this._provider = new Provider();
    }    
    
    public fromJSON(json: any): Expense {
        let exp = new Expense();

        exp.id = json.id;
        exp.billId = json.bill_id;
        exp.description = json.description;
        exp.value = json.value;
        exp.createdAt = json.createdAt;

        // En caso de tener proveedor
        if (json.provider) { exp.provider = new Provider().fromJSON(json.provider); }
        
        return exp;
    }

    set id(value: number) { this._id = value; }
    get id() { return this._id; }

    set billId(value: string) { this._billId = value; }
    get billId() { return this._billId; }

    set description(value: string) { this._description = value; }
    get description() { return this._description; }

    set value(value: number) { this._value = value; }
    get value() { return this._value; }

    set createdAt(value: Date) { this._createdAt = value; }
    get createdAt() { return this._createdAt; }

    set provider(value: Provider) { this._provider = value; }
    get provider() { return this._provider; }
}