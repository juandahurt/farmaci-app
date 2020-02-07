import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { Provider } from 'src/models/provider';

@Injectable()
export class ProviderService extends HttpService {

    constructor(protected http: HttpClient) { 
        super(http);
        this.apiUrl += 'provider';
    };

    /**
     * Crea un nuevo Proveedor
     * @param provider proveedor
     */
    public create(provider: Provider) {
        return this.http.post(
            this.apiUrl, 
            provider.JSON(),
            { headers: this.headers }
        );
    }

    /**
     * Obtiene los proveedores registrados
     */
    public list() {
        return this.http.get(this.apiUrl);
    }

    /**
     * Elimina un proveedor
     * @param id Identificador del proveedor
     */
    public delete(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers });
    }
}