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
  public productsSold: Array<ProductSold>;

  /**
   * Formulario de Búsqueda
   */
  public searchForm: FormGroup;

  /**
   * Total de la venta
   */
  public total: number;

  public UnitRef = Unit;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService
    ) {
    this.searchForm = this.formBuilder.group({
      id: ['', Validators.required]
    });
    this.productToFind = new ProductSold();
    this.productsSold = new Array<ProductSold>();
    this.total = 0;
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
      this.updateSubtotal();
    } catch(err) {
      ErrorHandler.showError(err);
      this.productToFind = new ProductSold();
    }
  }

  /**
   * Invocada al realizar un cambio en el tipo de unidad 
   */
  public unitTypeOnChange() {
    this.updateSubtotal();
  }

  /**
   * Invocada al realizar un cambio en la cantidad
   */
  public quantityOnChange() {
    this.updateSubtotal();
  }

  /**
   * Actualiza el subtotal
   */
  private updateSubtotal() {
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

  private setUnitaryPrice() {
    let product = this.productToFind.product;
    switch (this.productToFind.unitType) {
      case this.UnitRef.UnitType.BOX:
        this.productToFind.unitaryPrice = product.boxPrice;
        break;
      case this.UnitRef.UnitType.OTHER:
        this.productToFind.unitaryPrice = product.otherPrice;
        break;
      case this.UnitRef.UnitType.UNIT:
        this.productToFind.unitaryPrice = product.unitPrice;
        break;
    }
  }

  /**
   * Actualiza el subtotal de un producto ya agregado al carrito
   */
  private updateProductSoldSubtotal(product: ProductSold) {
    product.subtotal = product.unitaryPrice * product.quantity;
  } 

  /**
   * Añade un producto al carro de venta.
   * Es invocada al dar click en el botón `Agregar Producto`
   */
  public addProductToCart() {
    this.setUnitaryPrice();
    let notifier = new Notification();
    if (this.productToFind.unitType == null) { 
      notifier.showError('Debes seleccionar un tipo de unidad'); 
      return;
    }

    // Buscar si el producto y la unidad ya se encuentra dentro de la venta
    let found = false;
    for (var i = 0; i < this.productsSold.length; i++) {
      let id = this.productToFind.product.id;
      let unitType = this.productToFind.unitType;

      if (id == this.productsSold[i].product.id) {
        if (unitType == this.productsSold[i].unitType) {
          found = true;
          // Validar si la cantidad requerida se encuentra disponible
          let quantity = this.productToFind.quantity + this.productsSold[i].quantity;

          switch (unitType) {
            case this.UnitRef.UnitType.BOX:
              if (quantity > this.productToFind.product.boxQuantity) {
                notifier.showError('No hay suficientes cajas en bodega');
                return;
              }
              break;
            case this.UnitRef.UnitType.OTHER:
              if (quantity > this.productToFind.product.otherQuantity) {
                notifier.showError('No hay suficientes sobres en bodega');
                return;
              }
              break;
            case this.UnitRef.UnitType.UNIT:
              if (quantity > this.productToFind.product.unitQuantity) {
                notifier.showError('No hay suficientes unidades en bodega');
                return;
              }
              break;
          }
          // Se agrega la cantidad
          this.productsSold[i].quantity = quantity;
          this.updateProductSoldSubtotal(this.productsSold[i]);
          this.updateSubtotal();
        }
      }
    }

    if (!found) { this.productsSold.push(this.productToFind); }
    this.updateTotal();

    this.productToFind = new ProductSold();
    this.searchForm.controls.id.setValue('');
  }

  /**
   * Actualiza el total
   */
  private updateTotal() {
    this.total = 0;
    this.productsSold.forEach(productSold => {
      this.total += productSold.subtotal;
    });
  }

  /**
   * Invocada al dar click en Finalizar Venta
   */
  public checkout() {
    alert(JSON.stringify(this.productsSold));
  }
}
