import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable()
export class CategoryService {

    constructor() {};

    /**
     * Registra un producto
     * @param product producto a ser registrado
     */
    public async create(product: Product) {
        
    }

    /**
     * Actualiza un producto
     * @param id identificador del producto
     * @param product producto que contiene la información actualizada
     */
    public async update(id: string, product: Product) {
        
    }

    /**
     * Elimina un producto
     * @param id identificador del producto
     */
    public async delete(id: string) {
        return false;
    }
}