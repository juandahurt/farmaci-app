import { Component, OnInit } from '@angular/core';
import { Category } from 'src/models/category';
import { CategoryService } from 'src/services/category.service';
import { faSearch, faPlus, faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Notification } from 'src/helpers/notification';

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
  
  constructor(private categoryService: CategoryService, private router: Router) {
    this.setCategories();
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
      this.categories = new Array<Category>();

      categories.forEach(category => {
        let cat = new Category();

        cat.id = category.id;
        cat.name = category.name;

        this.categories.push(cat);
      });
    } catch(err) {
      // Manejar el error
    }
  }

  /**
   * Es invocada al hacer click en una categoría
   * @param id identificador de la categoría
   */
  public categoryOnClick(id: Number) {
    this.router.navigateByUrl(`categories/${id}`);
    // TODO:mostrar categoría 
  }

  /**
   * Es invocada al dar click el botón de registrar categoría
   */
  public async addOnClick() {
    const { value: formValues } = await Swal.fire({
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
        return [
          document.getElementById('name').value,
        ]
      }
    });

    let notification = new Notification();
    try {
      // Crea la nueva categoría
      let category = new Category();
      category.name = formValues[0];

      await this.categoryService.create(category).toPromise();
    } catch(err) {
      switch(err.status) {
        case 0:
          notification.showError('No se pudo extablecer una conexión con el servidor');
          break;
        case 200:
          notification.showSuccess('Categoría agregada exitosamente');
          this.setCategories();
          break;
        default:
          notification.showError(err.error.error); 
          break;
      }
    }
  }

}
