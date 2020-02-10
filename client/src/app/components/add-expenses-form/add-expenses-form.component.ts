import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Expense } from 'src/models/expense';
import { ErrorHandler } from 'src/helpers/error.helper';
import { Provider } from 'src/models/provider';
import { ProviderService } from 'src/services/provider.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ExpenseService } from 'src/services/expense.service';
import { ExpenseSharedService } from 'src/services/expense.shared.service';

@Component({
  selector: 'app-add-expenses-form',
  templateUrl: './add-expenses-form.component.html',
  styleUrls: ['./add-expenses-form.component.css']
})
export class AddExpensesFormComponent implements OnInit {
  /**
   * Icono de Agregar Egreso
   */
  public faPlus = faPlus

  /**
   * Egreso a agregar
   */
  public expense: Expense;

  /**
   * Proveedores registrados
   */
  public providers: Array<Provider>;

  public expenses: Array<Expense>;

  constructor(
    private modalService: NgbModal, 
    private providerService: ProviderService,
    private expenseService: ExpenseService,
    private expenseSharedService: ExpenseSharedService
    ) { 
    this.getProviders();
    this.expense = new Expense();
  }

  ngOnInit() {
  }

  /**
   * Abre el formulario
   * @param content Contenido del formulario
   */
  private open(content: any) {
    this.modalService.open(content, { centered: true });
  }

  /**
   * Cierra el formulario
   */
  private close() {
    this.modalService.dismissAll(null);
  }

  /**
   * Obtiene y setea los proveedores registrados
   */
  private async getProviders() {
    try {
      let res: any = await this.providerService.list().toPromise();

      this.providers = new Array<Provider>();
        res.forEach(provider => {
          this.providers.push(new Provider().fromJSON(provider));
        });
    } catch(err) {
      ErrorHandler.showError(err);
    }
  }

  /**
   * Obtiene y setea los egresos registrados
   */
  private async setExpenses() {
    try {
      let res: any = await this.expenseService.list().toPromise();

      this.expenses = new Array<Expense>();
      res.forEach(expense => {
        this.expenses.push(new Expense().fromJSON(expense));
      });
    } catch(err) {
      ErrorHandler.showError(err);
    }
  }

  /**
   * Invocada al dar click en Agregar
   */
  public async addOnClick() {
    try {
      await this.expenseService.create(this.expense).toPromise();
    } catch(err) {
      ErrorHandler.handleError(err, 'Egreso Agregado exitosamente');
      if (err.status != 422) {
        this.close();
        await this.setExpenses();
        this.expenseSharedService.changeExpenses(this.expenses);
      }
    }
  }
}
