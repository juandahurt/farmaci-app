import { Object } from './object';

export class Expense extends Object {
    /**
     * Identificador del egreso
     */
    private _id: number;

    /**
     * Descripción del egreso
     */
    private _description: string;

    /**
     * Fecha en que fue registrado
     */
    private _createdAt: Date;

    public initValues(): void {
        this._id = -1;
        this._description = '';
        this._createdAt = new Date();
    }    
    
    public fromJSON(json: any): Expense {
        let exp = new Expense();

        exp.id = json.id;
        exp.description = json.description;
        exp.createdAt = json.createdAt;

        return exp;
    }

    set id(value: number) { this._id = value; }
    get id() { return this._id; }

    set description(value: string) { this._description = value; }
    get description() { return this._description; }

    set createdAt(value: Date) { this._createdAt = value; }
    get createdAt() { return this._createdAt; }
}