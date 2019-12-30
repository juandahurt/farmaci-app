import {Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { Product } from 'src/models/product';


@Injectable()
export class ProductService extends HttpService {
    
    constructor(protected http: HttpClient) { 
        super(http);
        this.apiUrl += 'product';
    };

    /**
     * Obtiene todos los productos desde el servidor
     */
    public list() {
        return this.http.get(this.apiUrl, { headers: this.headers });
    }

    /**
     * Registra un nuevo producto
     * @param product producto a ser registrado
     */
    public create(product: Product) {
        return this.http.post(this.apiUrl, product.JSON(), { headers: this.headers });
    }

    /**
     * Obtiene un producto desde el servidor
     * @param id identificador del producto
     */
    public get(id: string) {
        return this.http.get(`${this.apiUrl}/${id}`, { headers: this.headers });
    }

    /**
     * Elimina un producto
     * @param id identificador del producto
     */
    public delete(id: string) {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers });
    }

    /**
     * Actualiza un producto
     * @param id identificador del producto
     * @param product contiene la información actualizda del producto
     */
    public update(id: string, product: Product) {
        return this.http.put(`${this.apiUrl}/${id}`, product.JSON(),{ headers: this.headers });
    }
}