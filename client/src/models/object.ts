export abstract class Object {

    constructor() {}

    /**
     * Inicializa los atributos de la clase
     */
    public abstract initValues(): void;

    /**
     * Convierte el objeto tipo Objecto a un objeto JSON
     */
    public JSON():JSON { return JSON.parse(JSON.stringify(this)) };
}