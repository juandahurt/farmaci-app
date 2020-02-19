import { Component, OnInit } from '@angular/core';
import { Category } from 'src/models/category';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/services/category.service';
import { faArrowLeft, faPen, faTrashAlt, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Notification } from 'src/helpers/notification.helper';
import { ConfirmForm } from 'src/helpers/confirm-form.helper';
import { ErrorHandler } from 'src/helpers/error.helper';
import { Product } from 'src/models/product';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';

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
   * Productos pertenecientes a la categoría
   */
  public products: Array<Product>

  /**
   * Para saber si se puede editar la categoría
   */
  public isEditable: Boolean;

  /**
   * ¿Está cargando la petición?
   */
  public isLoading: boolean;

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

  public sidebarRef = SidebarComponent;

  constructor(private route: ActivatedRoute, private router: Router ,private categoryService: CategoryService) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isLoading = true;
    this.setCategory().then(() => {
      this.name = this.category.name;
      this.pageSize = 5;
      this.collectionSize = this.products.length;
      this.page = 1;
      this.isLoading = false;
    }).catch((err) => {
      this.isLoading = false;
    });
  }

  ngOnInit() {
  }

  /**
   * Obtiene y setea la categoría
   */
  private async setCategory() {
    let res: any = await this.categoryService.get(this.id).toPromise();
    this.category = new Category().fromJSON(res.category);
    let products = res.products as Array<any>;
    if (products.length > 0) {
      this.products = new Array<Product>();

      products.forEach(product => {
        let p = new Product();
        p.id = product.id;
        p.description = product.description;
        this.products.push(p);
      });
    }
  }
 
  /**
   * Invocada al dar click en Regresar
   */
  public backOnClick() {
    this.router.navigateByUrl("");
    this.sidebarRef.categoriesOnClick();
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
      this.setCategory();
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
