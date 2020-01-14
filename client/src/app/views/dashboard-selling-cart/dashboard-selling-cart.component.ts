import { Component, OnInit } from '@angular/core';
import { faSearch, faArrowDown, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { ProductSold } from 'src/models/product-sold';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Notification } from 'src/helpers/notification.helper';
import { ProductService } from 'src/services/product.service';
import { ErrorHandler } from 'src/helpers/error.helper';
import { Product } from 'src/models/product';
import { Unit } from 'src/models/unit';

@Component({
  selector: 'app-dashboard-selling-cart',
  templateUrl: './dashboard-selling-cart.component.html',
  styleUrls: ['./dashboard-selling-cart.component.css']
})
export class DashboardSellingCartComponent implements OnInit {
  /**
   * Icono de Buscar
   */
  public faSearch = faSearch;

  /**
   * Icono de Agregar Producto
   */
  public faArrowDown = faArrowDown;

  /**
   * Icono de Registrar Venta
   */
  public faMoneyBill = faMoneyBill;

  /**
   * Producto que se va a buscar a la base de datos
   */
  public productToFind: ProductSold;

  /**
   * Productos a ser vendidos
   */
  public prodcutsSold: Array<ProductSold>;

  /**
   * Formulario de Búsqueda
   */
  public searchForm: FormGroup;

  public UnitRef = Unit;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService
    ) {
    this.searchForm = this.formBuilder.group({
      id: ['', Validators.required]
    });
    this.productToFind = new ProductSold();
  }

  ngOnInit() {
    
  }

  /**
   * Para acceder más facilmente a los atributos del formulario
   */
  get f() { return this.searchForm.controls; }

  /**
   * Invocada en hacer submit en el formulario de búsqueda
   */
  public async searchProduct() {
    let id = this.f.id.value;
    let notifier = new Notification();

    if (!id) {
      notifier.showError('Debes ingresar un identificador');
      return;
    }
    
    try {
      let res = await this.productService.get(id).toPromise();
      this.productToFind.product = new Product().fromJSON(res);
      this.setSubtotal();
    } catch(err) {
      ErrorHandler.showError(err);
    }
  }

  /**
   * Invocada al realizar un cambio en el tipo de unidad 
   */
  public unitTypeOnChange() {
    this.setSubtotal();
  }

  /**
   * Invocada al realizar un cambio en la cantidad
   */
  public quantityOnChange() {
    this.setSubtotal();
  }

  private setSubtotal() {
    switch (this.productToFind.unitType) {
      case this.UnitRef.UnitType.BOX:
        this.productToFind.subtotal = this.productToFind.quantity * this.productToFind.product.boxPrice;
        break;
      case this.UnitRef.UnitType.OTHER:
        this.productToFind.subtotal = this.productToFind.quantity * this.productToFind.product.otherPrice;
        break;
      case this.UnitRef.UnitType.UNIT:
        this.productToFind.subtotal = this.productToFind.quantity * this.productToFind.product.unitPrice;
        break;
    }
  }

  /**
   * Añade un producto al carro de venta.
   * Es invocada al dar click en el botón `Agregar Producto`
   */
  public addProductToCart() {
    let notifier = new Notification();

    if (this.productToFind.unitType == null) { 
      notifier.showError('Debes seleccionar un tipo de unidad'); 
      return;
    }

    this.productToFind = new ProductSold();
    this.searchForm.controls.id.setValue('');
  }

  /**
   * Invocada al dar click en Finalizar Venta
   */
  public checkout() {
    
  }
}
