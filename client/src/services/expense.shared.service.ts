import { Injectable, Output, EventEmitter } from '@angular/core';
import { Expense } from 'src/models/expense';

@Injectable()
export class ExpenseSharedService {
    @Output() expensesEmitter: EventEmitter<any> = new EventEmitter();

    constructor() { }
 
    public changeExpenses(expenses: Array<Expense>) {
        this.expensesEmitter.emit(expenses);
    }

    public getExpenses() {
        return this.expensesEmitter;
    }
}