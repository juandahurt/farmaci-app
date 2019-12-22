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

    /**
     * Retorna una instancia de la clase con los atributos del objeto json
     * @param json objeto en formato JSON
     */
    public abstract fromJSON(json: any): Object;
}