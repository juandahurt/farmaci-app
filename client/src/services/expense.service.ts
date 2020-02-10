import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { Expense } from 'src/models/expense';

@Injectable()
export class ExpenseService extends HttpService {

    constructor(protected http: HttpClient) { 
        super(http);
        this.apiUrl += 'expense';
    };

    /**
     * Obtiene los egresos desde el servidor
     */
    public list() {
        return this.http.get(this.apiUrl, { headers: this.headers });
    }

    /**
     * Crea un nuevo egreso
     * @param expense Categoría a ser creada
     */
    public create(expense: Expense) {
        return this.http.post(this.apiUrl, expense.JSON() ,{ headers: this.headers });
    }

    /**
     * Elimina un egreso
     * @param id Identificador del egreso
     */
    public delete(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers });
    }
}