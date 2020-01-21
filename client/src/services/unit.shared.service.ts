import { Injectable, Output, EventEmitter } from '@angular/core';
import { Unit } from 'src/models/unit';

@Injectable()
export class UnitSharedService {
    @Output() unitsEmitter: EventEmitter<any> = new EventEmitter();

    constructor() { }
 
    public changeUnits(units: Array<Unit>) {
        this.unitsEmitter.emit(units);
    }

    public getUnits() {
        return this.unitsEmitter;
    }
}