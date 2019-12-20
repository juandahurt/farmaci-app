import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/models/category';

@Injectable()
export class CategoryService extends HttpService {

    constructor(protected http: HttpClient) { 
        super(http);
        this.apiUrl += 'category';
    };

    /**
     * Obtiene las categorías desde el servidor
     */
    public list() {
        return this.http.get(this.apiUrl, { headers: this.headers });
    }

    /**
     * Crea una nueva categoría
     * @param category Categoría a ser creada
     */
    public create(category: Category) {
        return this.http.post(this.apiUrl, category.JSON() ,{ headers: this.headers });
    }
}