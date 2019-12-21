import { Object } from './object';

export class Category extends Object {
    /**
     * Identificador de la categoría
     */
    private _id: Number;

    /**
     * Nombre de la categoría
     */
    private _name: string;

    constructor() { super(); }

    public initValues(): void {
        this._id = -1;
        this._name = '';
    }

    public fromJSON(json: any): Category {
        let cat = new Category();

        cat.id = json.id;
        cat.name = json.name;

        return cat;
    }

    set id(value: Number) { this._id = value; }
    get id(): Number { return this._id; }

    set name(value: string) { this._name = value; }
    get name(): string { return this._name; }
}