import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Category } from 'src/models/category';
import { CategoryService } from 'src/services/category.service';
import { ErrorHandler } from 'src/helpers/error.helper';
import { Product } from 'src/models/product';
import { ProductService } from 'src/services/product.service';
import { Router } from '@angular/router';
import { Notification } from 'src/helpers/notification.helper';

@Component({
  selector: 'app-add-product-form',
  templateUrl: './add-product-form.component.html',
  styleUrls: ['./add-product-form.component.less']
})
export class AddProductFormComponent implements OnInit {
  /**
   * Icono de Agregar producto
   */
  private faPlus = faPlus;

  /**
   * Categorías registradas
   */
  private categories: Array<Category>;

  /**
   * Controla el switch de cajas
   */
  public comesInBoxes: boolean;

  /**
   * Controla el switch de cajas
   */
  public comesInUnits: boolean;

  /**
   * Controla el switch de cajas
   */
  public comesInOthers: boolean;

  /**
   * Producto a ser agregado
   */
  public product: Product;

  constructor(
    private modalService: NgbModal, 
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router
    ) {
    this.product = new Product();
    this.setCategories();
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

  private close() {
    this.modalService.dismissAll(null);
  }

  /**
   * Obtiene y setea las categorías
   */
  private async setCategories() {
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
      ErrorHandler.showError(err);
    }
  }

  /**
   * Es Invocada al dar click en el switch de Cajas
   */
  private boxesOnClick() {
    this.comesInBoxes = !this.comesInBoxes;
  }

  /**
   * Es Invocada al dar click en el switch de Unidades
   */
  private unitsOnClick() {
    this.comesInUnits = !this.comesInUnits;
  }

  /**
   * Es Invocada al dar click en el switch de Sobres
   */
  private othersOnClick() {
    this.comesInOthers = !this.comesInOthers;
  }

  /**
   * Invocada al dar click en Agregar Producto
   */
  private async addOnClick() {
    try {
      let res = await this.productService.create(this.product).toPromise();
      let product = new Product().fromJSON(res);
      this.router.navigateByUrl(`products/${product.id}`);
      this.close();
      let notification = new Notification();
      notification.showSuccess('Producto agregado exitosamente');
    } catch (err) {
      ErrorHandler.showError(err);
    }
  }
}
