import { Injectable, Output, EventEmitter } from '@angular/core';
import { Dimension } from 'src/models/dimension';

@Injectable()
export class DimensionSharedService {
    @Output() haveBeenSetEmitter: EventEmitter<any> = new EventEmitter();
    @Output() dimensionEmitter: EventEmitter<any> = new EventEmitter();

    constructor() { }
 
    public changeHaveBeenSet(dimensionsHaveBeenSet: boolean) {
        this.haveBeenSetEmitter.emit(dimensionsHaveBeenSet);
    }
 
    public changeDimension(dimension: Dimension) {
        this.dimensionEmitter.emit(dimension);
    }

    public getHaveBeenSet() {
        return this.haveBeenSetEmitter;
    }

    public getDimension() {
        return this.dimensionEmitter;
    }
}