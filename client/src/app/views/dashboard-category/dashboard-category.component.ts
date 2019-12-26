import { Component, OnInit } from '@angular/core';
import { Category } from 'src/models/category';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/services/category.service';
import { faArrowLeft, faPen, faTrashAlt, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Notification } from 'src/helpers/notification.helper';
import { ConfirmForm } from 'src/helpers/confirm-form.helper';
import { ErrorHandler } from 'src/helpers/error.helper';

@Component({
  selector: 'app-dashboard-category',
  templateUrl: './dashboard-category.component.html',
  styleUrls: ['./dashboard-category.component.css']
})
export class DashboardCategoryComponent implements OnInit {
  /**
   * Icono de Regresar
   */
  public faArrowLeft = faArrowLeft;

  /**
   * Icono de Editar
   */
  public faPen = faPen;

  /**
   * Icono de Eliminar
   */
  public faTrashAlt = faTrashAlt;

  /**
   * Icono de Actualizar
   */
  public faCheck = faCheck;

  /**
   * Icono de Cancelar
   */
  public faTimes = faTimes;

  /**
   * Identificador de la categoría
   */
  private id: string;

  /**
   * Nombre de la categoría
   */
  public name: string;

  /**
   * Categoría
   */
  public category: Category;

  /**
   * Para saber si se puede editar la categoría
   */
  public isEditable: Boolean;

  constructor(private route: ActivatedRoute, private router: Router ,private categoryService: CategoryService) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.setCategory().then(() => {
      this.name = this.category.name;
    });
  }

  ngOnInit() {
  }

  /**
   * Obtiene y setea la categoría
   */
  private async setCategory() {
    let res = await this.categoryService.get(this.id).toPromise();
    this.category = new Category().fromJSON(res);
  }
 
  /**
   * Invocada al dar click en Regresar
   */
  public backOnClick() {
    this.router.navigateByUrl("categories");
  }

  /**
   * Es invocada al dar click en editar
   */
  public editOnClick(): void {
    this.isEditable = !this.isEditable;
  }

  /**
   * Es invocada al dar click en cancelar
   */
  public cancelOnClick() {
    this.isEditable = false;
  }

  /**
   * Es invocada al dar click en actualizar
   */
  public async updateOnClick() {
    this.isEditable = false;
    let notification = new Notification();
    try {
      let cat = new Category();
      cat.name = this.name;
      
      await this.categoryService.update(this.id, cat).toPromise();
      notification.showSuccess('Categoría actualizada exitosamente');
    } catch(err) {
      ErrorHandler.showError(err);
      this.name = this.category.name;
    }
  }

  /**
   * Es invocada al dar click en Eliminar
   */
  public async deleteOnClick() {
    let confirmForm = new ConfirmForm();
    let res = await confirmForm.show('¿Está seguro?', 'La categoría será eliminada de forma permanente');

    if (res.value) {
      try {
        await this.categoryService.delete(this.id).toPromise();
        
      } catch(err) {
        ErrorHandler.handleError(err, 'Categoría eliminada exitosamente');
        if (err.status == 200) { this.router.navigateByUrl("categories"); }
      }
    }
  }
}
