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

    /**
     * Obtiene una categoría
     * @param id Identificador de la categoría
     */
    public get(id: string) {
        return this.http.get(`${this.apiUrl}/${id}`, { headers: this.headers });
    }

    /**
     * Actualiza una categoría
     * @param id Identificador de la categoría
     * @param category Contiene la nueva información de la categoría
     */
    public update(id: string, category: Category) {
        return this.http.put(`${this.apiUrl}/${id}`, category.JSON(), { headers: this.headers });
    }

    /**
     * Elimina una categoría
     * @param id Identificador de la categoría
     */
    public delete(id: string) {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers });
    }
}