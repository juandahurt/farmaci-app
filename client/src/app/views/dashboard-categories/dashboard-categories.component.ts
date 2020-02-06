import { Component, OnInit } from '@angular/core';
import { Category } from 'src/models/category';
import { CategoryService } from 'src/services/category.service';
import { faSearch, faPlus, faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Notification } from 'src/helpers/notification.helper';
import { ErrorHandler } from 'src/helpers/error.helper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard-categories',
  templateUrl: './dashboard-categories.component.html',
  styleUrls: ['./dashboard-categories.component.css']
})
export class DashboardCategoriesComponent implements OnInit {
  /**
   * Contiene las cateogrías registradas
   */
  public categories: Array<Category>;

  /**
   * Icono de busqueda
   */
  public faSearch = faSearch;

  /**
   * Icono de registrar categoría
   */
  public faPlus = faPlus;

  /**
   * Icono de editar categoría
   */
  public faPen = faPen;

  /**
   * Icono de eliminar categoría
   */
  public faTrashAlt = faTrashAlt;

  /**
   * Formulario de búsqueda
   */
  private searchForm: FormGroup;
  
  /**
   * ¿Está cargando la petición?
   */
  public isLoading: boolean;
  
  constructor(
    private categoryService: CategoryService, 
    private router: Router,
    private formBuilder: FormBuilder) {
    this.isLoading = true;
    this.setCategories().then(() => {
      this.isLoading = false;
    }).then((err) => {
      this.isLoading = false;
    });
    this.searchForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  /**
   * Setea las categorías registradas
   */
  public async setCategories() {
    try {
      let res = await this.categoryService.list().toPromise();
      let categories = res as Array<any>;
      if (categories.length > 0) {
        this.categories = new Array<Category>();

        categories.forEach(category => {
          let cat = new Category();
  
          cat.id = category.id;
          cat.name = category.name;
  
          this.categories.push(cat);
        });
      }
    } catch(err) {
      ErrorHandler.showError(err);
    }
  }

  /**
   * Es invocada al hacer click en una categoría
   * @param id identificador de la categoría
   */
  public categoryOnClick(id: Number) {
    this.router.navigateByUrl(`categories/${id}`);
  }

  /**
   * Es invocada al dar click el botón de registrar categoría
   */
  public async addOnClick() {
    const { value: formValue } = await Swal.fire({
      customClass: {
        confirmButton: 'btn btn-success',
        title: 'text-dark mb-3'
      },
      title: 'Agregar Categoría',
      html:
        '<input type="text" id="name" class="form-control mt-3 bg-light border-0 shadow-sm" placeholder="Nombre">',
      focusConfirm: false,
      buttonsStyling: false,
      confirmButtonText: 'Agregar',
      preConfirm: () => {
       return document.getElementsByTagName('input')[1].value;
      }
    });

    try {
      // Crea la nueva categoría
      let category = new Category();
      category.name = formValue;

      await this.categoryService.create(category).toPromise();
    } catch(err) {
      ErrorHandler.handleError(err, 'Categoría agregada exitosamente');
    } finally {
      this.setCategories();
    }
  }

  /**
   * 
   */
  public async searchCategory() {
    let name = this.searchForm.controls.name.value.toLowerCase();
    let notifier = new Notification();

    if (!name) {
      notifier.showError('Debes ingresar un nombre');
      return;
    }

    var found = false;
    for(var i = 0; i < this.categories.length; i++) {
      if (this.categories[i].name.toLowerCase() === name) {
        found = true;
        this.router.navigateByUrl(`categories/${this.categories[i].id}`);
        break;
      }
    }

    if (!found) { notifier.showError('Categoría no encontrada'); }
  }
}
