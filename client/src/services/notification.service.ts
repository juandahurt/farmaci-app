import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class NotificationService extends HttpService {

    constructor(protected http: HttpClient) { 
        super(http);
        this.apiUrl += 'notification';
    };

    /**
     * Obtiene las notificaciones desde el servidor
     */
    public get() {
        return this.http.get(this.apiUrl, { headers: this.headers });
    }

    /**
     * Elimina una notificación
     * @param id Identificador de la notificación
     */
    public delete(id: number) {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers });
    }
}