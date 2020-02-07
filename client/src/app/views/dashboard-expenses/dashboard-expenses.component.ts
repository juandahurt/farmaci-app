import { Component, OnInit } from '@angular/core';
import { ExpenseService } from 'src/services/expense.service';
import Swal from 'sweetalert2';
import { Expense } from 'src/models/expense';
import { ErrorHandler } from 'src/helpers/error.helper';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { DateHelper } from 'src/helpers/date.helper';

@Component({
  selector: 'app-dashboard-expenses',
  templateUrl: './dashboard-expenses.component.html',
  styleUrls: ['./dashboard-expenses.component.css']
})
export class DashboardExpensesComponent implements OnInit {
  /**
   * Icono de agregar egreso
   */
  faPlus = faPlus;

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

  public desc;

  constructor(private expenseService: ExpenseService) {
    this.setExpenses().then(() => {
      this.page = 1;
      this.pageSize = 8;
      this.collectionSize = this.expenses.length;
    });
  }

  ngOnInit() {
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
   * Es invocada al dar click el botón Registrar Egreso
   */
  public async addOnClick() {
    const { value: formValue } = await Swal.fire({
      customClass: {
        confirmButton: 'btn btn-success',
        title: 'text-dark mb-3'
      },
      title: 'Agregar Egreso',
      html:
        '<input name="desc" [(ngModel)]="desc" type="text" id="description" class="form-control mt-3 bg-light border-0 shadow-sm" placeholder="Descripción">',
      focusConfirm: false,
      buttonsStyling: false,
      confirmButtonText: 'Agregar',
      preConfirm: () => {
        return 'asf'
        //return document.getElementById('description').value
      },
    });

    try {
      // Crea el nuevo egreso
      let expense = new Expense();
      expense.description = formValue;

      await this.expenseService.create(expense).toPromise();
    } catch(err) {
      ErrorHandler.handleError(err, 'Egreso agregado exitosamente');
    } finally {
      this.setExpenses();
    }
  }

  /**
   * Invocada al dar click en Eliminar Egreso
   * @param id identificador del egreso
   */
  public async deleteOnClick(id: number) {
    try {
      await this.expenseService.delete(id).toPromise();
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
