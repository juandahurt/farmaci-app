import { Object } from './object';

export class Provider extends Object {
    /**
     * Identificador del Proveedor
     */
    private _id: number;

    /**
     * Nombre del Proveedor
     */
    private _name: string;

    public initValues(): void {
        this._id = null;
        this._name = '';
    }    
    
    public fromJSON(json: any): Provider {
        let p = new Provider();

        p.id = json.id;
        p.name = json.name;

        return p;
    }

    get id() { return this._id; }
    set id(value: number) { this._id = value; }

    get name() { return this._name; }
    set name(value: string) { this._name = value; }
}