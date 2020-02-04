import { Component, OnInit } from '@angular/core';
import { faArrowLeft, faPen, faTrashAlt, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Product } from 'src/models/product';
import { ProductService } from 'src/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmForm } from 'src/helpers/confirm-form.helper';
import { Category } from 'src/models/category';
import { CategoryService } from 'src/services/category.service';
import { ErrorHandler } from 'src/helpers/error.helper';
import { DimensionService } from 'src/services/dimension.service';
import { Dimension } from 'src/models/dimension';
import { DimensionSharedService } from 'src/services/dimension.shared.service';
import { UnitService } from 'src/services/unit.service';
import { Unit } from 'src/models/unit';
import { DateHelper } from 'src/helpers/date.helper';
import { UnitSharedService } from 'src/services/unit.shared.service';

@Component({
  selector: 'app-dashboard-product',
  templateUrl: './dashboard-product.component.html',
  styleUrls: ['./dashboard-product.component.css']
})
export class DashboardProductComponent implements OnInit {
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
   * Identificador del producto
   */
  public id: string;

  /**
   * Producto
   */
  public product: Product;

  /**
   * ¿Es el formulario del producto editable?
   */
  public isEditable: boolean;

  /**
   * Categorías registradas
   */
  public categories: Array<Category>;

  /**
   * ¿Las dimensiones has sido seteadas?
   */
  public dimensionsHaveBeenSet: boolean;

  /**
   * Dimensiones del productos
   */
  public dimension: Dimension;

  constructor(
    private productService: ProductService, 
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router,
    private dimensionService: DimensionService,
    private dimensionSharedService: DimensionSharedService,
    private unitService: UnitService,
    private unitSharedService: UnitSharedService
    ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.setProduct().then(() => { 
      this.setDimension(); 
      this.setUnits();
    });
    this.setCategories();
  }

  ngOnInit() {
    this.dimensionSharedService.getHaveBeenSet().subscribe(value => this.dimensionsHaveBeenSet = value);
    this.dimensionSharedService.getDimension().subscribe(value => this.dimension = value);
    this.unitSharedService.getUnits().subscribe(value => this.product.units = value);
  }

  /**
   * Obtiene la información del producto y la setea
   */
  private async setProduct() {
    try {
      let res = await this.productService.get(this.id).toPromise();
      this.product = new Product().fromJSON(res);
    } catch(err) {
      ErrorHandler.showError(err);
    }
  }

  /**
   * Obtiene y setea las unidades del producto
   */
  private async setUnits() {
    try {
      let res = await this.unitService.list(this.id).toPromise();
      let units = res as Array<any>;

      if (units.length > 0) {
        this.product.units = new Array<Unit>();

        units.forEach(unit => {
          let u = new Unit().fromJSON(unit);
          this.product.units.push(u);
        });
      } else {
        this.product.units = null;
      }
    } catch(err) {
      ErrorHandler.showError(err);
    }
  }

  /**
   * Obtiene y setea las dimensiones del producto
   */
  private async setDimension() {
    try {
      if (this.product.comesInBoxes && !this.product.comesInOthers && !this.product.comesInUnits) {
        this.dimensionsHaveBeenSet = true;
        return;
      }
      if (!this.product.comesInBoxes && this.product.comesInOthers && !this.product.comesInUnits) {
        this.dimensionsHaveBeenSet = true;
        return;
      }
      if (!this.product.comesInBoxes && !this.product.comesInOthers && this.product.comesInUnits) {
        this.dimensionsHaveBeenSet = true;
        return;
      }
      let dim = await this.dimensionService.get(this.product.id).toPromise();
      this.dimensionsHaveBeenSet = dim != null;
      
      this.dimension = new Dimension().fromJSON(dim);
    } catch (err) {
      ErrorHandler.showError(err);
    }
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
   * Invocada al dar click en Editar
   */
  public editOnClick() {
    this.isEditable = !this.isEditable;
  }

  public dateToString(date: string) {
    return DateHelper.cleanDate(date);
  }

  /**
   * Invocada al dar click en Eliminar
   */
  public async deleteOnClick() {
    let confirmForm = new ConfirmForm();
    let res = await confirmForm.show('¿Está seguro?', 'El producto será eliminado de forma permanente');

    if (res.value) {
      try {
        await this.productService.delete(this.id).toPromise();
      } catch(err) {
        ErrorHandler.handleError(err, 'Producto eliminado exitosamente');
        if (err.status == 200) { this.router.navigateByUrl("products"); }
      }
    }
  }

  /**
   * Invocada al haer click en Actualizar
   */
  public async updateOnClick() {
    try {
      await this.productService.update(this.id, this.product).toPromise();
    } catch(err) {
      ErrorHandler.handleError(err, 'Producto actualizado exitosamente');
      if (err.status == 200) {
        this.isEditable = false;
        this.setProduct();
      }
    }
  }

  /**
   * Invocada al dar click en Regresar
   */
  public backOnClick() {
    this.router.navigateByUrl("products");
  }


  /**
   * Invocada al dar click en cancelar
   */
  public cancelOnClick() {
    this.isEditable = false;
    this.setProduct().then(() => { 
      this.setDimension(); 
      this.setUnits();
    });
    this.setCategories();
  }

  /**
   * Invocada al dar click en el Icono de Eliminar Unidad
   */
  public async deleteUnitOnClick(unitId: number) {
    try {
      let res = await new ConfirmForm().show('¿Estás seguro?', 'La unidad será eliminada permanentemente');
      if (res.value) { await this.unitService.delete(this.id, unitId).toPromise(); }
    } catch(err) {
      ErrorHandler.handleError(err, 'Unidad eliminada exitosamente');
      this.setUnits();
    }
  }
}
