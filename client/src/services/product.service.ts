import {Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';


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
}