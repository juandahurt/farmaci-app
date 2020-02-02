import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class StatsService extends HttpService {

    constructor(protected http: HttpClient) { 
        super(http);
        this.apiUrl += 'stats';
    };

    /**
     * Obtiene las estadísticas
     * @param date rango de fecha, puede ser 0, 1, 2, 3 ó 4
     */
    public get(date: number) {
        return this.http.post(
            this.apiUrl, 
            {date: date},
            { headers: this.headers }
        );
    }
}