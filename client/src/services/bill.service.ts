import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { ProductSold } from 'src/models/product-sold';

@Injectable()
export class BillService extends HttpService {

    constructor(protected http: HttpClient) { 
        super(http);
        this.apiUrl += 'bill';
    };

    /**
     * Crea una nueva factura
     * @param products Productos vendidos
     */
    public create(products: Array<ProductSold>) {
        return this.http.post(this.apiUrl, JSON.parse(JSON.stringify(products)) ,{ headers: this.headers });
    }
}