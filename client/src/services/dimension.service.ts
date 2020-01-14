import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/models/category';
import { Dimension } from 'src/models/dimension';

@Injectable()
export class DimensionService extends HttpService {

    constructor(protected http: HttpClient) { 
        super(http);
        this.apiUrl += 'dimension';
    };

    /**
     * Agrega las dimensiones de un productos
     * @param id Identificador del producto
     * @param dimension Dimensiones del producto
     */
    public create(id: string, dimension: Dimension) {
        return this.http.post(
            this.apiUrl, 
            {
                product_id: id,
                dimension: dimension.JSON()
            },
            { headers: this.headers }
        );
    }

    /**
     * Obtiene las dimensiones de un producto
     * @param id Identificador del producto
     */
    public get(id: string) {
        return this.http.get(`${this.apiUrl}/${id}`, { headers: this.headers });
    }
}