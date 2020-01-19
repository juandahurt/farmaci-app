import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { Unit } from 'src/models/unit';

@Injectable()
export class UnitService extends HttpService {

    constructor(protected http: HttpClient) { 
        super(http);
        this.apiUrl += 'unit';
    };

    /**
     * Agrega unidades a un producto
     * @param id Identificador del producto
     * @param unit Unidad a agregar
     */
    public create(id: string, unit: Unit) {
        return this.http.post(
            `${this.apiUrl}/${id}`, 
            unit.JSON(),
            { headers: this.headers }
        );
    }

    /**
     * Obtiene las unidades de un producto
     * @param id Identificador del producto
     */
    public list(id: string) {
        return this.http.get(`${this.apiUrl}/${id}`, { headers: this.headers });
    }
}