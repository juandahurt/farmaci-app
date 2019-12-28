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
}