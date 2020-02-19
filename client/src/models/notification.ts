import { Object } from './object';

export class Notification extends Object {
    /**
     * Identificador de la notificación
     */
    public id: number;

    /**
     * Descripción de la notificación
     */
    public description: string;

    constructor() {
        super();
    }

    public initValues(): void {
        this.id = -1;
        this.description = "";
    }
    
    public fromJSON(json: any): Notification {
        var n = new Notification();

        n.id = json.id;
        n.description = json.description

        return n;
    }


}