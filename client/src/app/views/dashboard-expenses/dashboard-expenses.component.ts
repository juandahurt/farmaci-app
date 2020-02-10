import { Component, OnInit } from '@angular/core';
import { ExpenseService } from 'src/services/expense.service';
import Swal from 'sweetalert2';
import { Expense } from 'src/models/expense';
import { ErrorHandler } from 'src/helpers/error.helper';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { DateHelper } from 'src/helpers/date.helper';
import { ConfirmForm } from 'src/helpers/confirm-form.helper';
import { ExpenseSharedService } from 'src/services/expense.shared.service';

@Component({
  selector: 'app-dashboard-expenses',
  templateUrl: './dashboard-expenses.component.html',
  styleUrls: ['./dashboard-expenses.component.css']
})
export class DashboardExpensesComponent implements OnInit {
  /**
   * Icono de eliminar egreso
   */
  faTrashAlt = faTrashAlt;

  /**
   * Lista de egresos registrados
   */
  public expenses: Array<Expense>;

  /**
   * Página actual
   */
  public page: number;

  /**
   * Tamaño de cada página
   */
  public pageSize: number;

  /**
   * Tamaño de la lista
   */
  public collectionSize: number;

  /**
   * ¿Está cargando la petición?
   */
  public isLoading: boolean;

  constructor(private expenseService: ExpenseService, private expenseSharedService: ExpenseSharedService) {
    this.setExpenses().then(() => {
      this.page = 1;
      this.pageSize = 8;
      this.collectionSize = 0;
      if (this.expenses != null) { this.collectionSize = this.expenses.length; }
    });
  }

  ngOnInit() {
    this.expenseSharedService.getExpenses().subscribe(value => {  this.expenses = value; });
  }

  /**
   * Obtiene y setea los egresos
   */
  private async setExpenses() {
    try {
      this.isLoading = true;
      let res: any = await this.expenseService.list().toPromise();

      if (res.length > 0) {
        this.expenses = new Array<Expense>();
        res.forEach(expense => {
          this.expenses.push(new Expense().fromJSON(expense));
        });
      } else { this.expenses = null; }
      this.isLoading = false;
    } catch(err) {
      ErrorHandler.showError(err);
      this.isLoading = false;
    }
  }

  /**
   * Invocada al dar click en Eliminar Egreso
   * @param id identificador del egreso
   */
  public async deleteOnClick(id: number) {
    try {
      let res: any = await new ConfirmForm().show('¿Está seguro?', 'El egreso será eliminado de forma permanente');
      if (res.value) { await this.expenseService.delete(id).toPromise(); }
    } catch(err) {
      ErrorHandler.handleError(err, 'Egreso eliminado exitosamente');
      this.setExpenses();
    }
  }

  /**
   * Convierte una fecha a string y la formatea
   * @param date fecha
   */
  public dateToString(date: string) {
    return DateHelper.cleanDate(date);
  }
}
