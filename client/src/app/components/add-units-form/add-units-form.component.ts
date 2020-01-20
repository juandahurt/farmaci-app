import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faTruckLoading, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Product } from 'src/models/product';
import { ProductService } from 'src/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { ErrorHandler } from 'src/helpers/error.helper';
import { UnitService } from 'src/services/unit.service';
import { Unit } from 'src/models/unit';
import { Notification } from 'src/helpers/notification.helper';
import { Dimension } from 'src/models/dimension';
import { DimensionService } from 'src/services/dimension.service';

@Component({
  selector: 'app-add-units-form',
  templateUrl: './add-units-form.component.html',
  styleUrls: ['./add-units-form.component.css']
})
export class AddUnitsFormComponent implements OnInit {
  /**
   * Icono de Ingresar Unidades
   */
  public faTruckLoading = faTruckLoading;

  /**
   * Icono de Fecha de Vencimiento
   */
  public faCalendarAlt = faCalendarAlt;

  /**
   * Identificador del producto
   */
  private _id: string;

  /**
   * Producto al que se le van a añadir la unidade
   */
  public product: Product;

  /**
   * Unidad a agregar
   */
  public unit: Unit;

  constructor(
    private modalService: NgbModal,
    private productService: ProductService,
    private route: ActivatedRoute,
    private unitService: UnitService
  ) {
    this._id = route.snapshot.paramMap.get('id');
    this.setProduct();
    this.unit = new Unit();
  }

  ngOnInit() {
  }

  /**
   * Obtiene e inicializa el producto
   */
  private async setProduct() {
    try {
      let res = await this.productService.get(this._id).toPromise();
      this.product = new Product().fromJSON(res);
    } catch (err) {
      ErrorHandler.showError(err);
    }
  }

  /**
   * Abre el formulario
   * @param content Contenido del formulario
   */
  private open(content: any) {
    this.modalService.open(content, { centered: true });
  }

  /**
   * Cierra el formulario
   */
  private close() {
    this.modalService.dismissAll(null);
  }

  /**
   * Invacada al dar click en Agregar
   */
  public async addOnClick() {
    try {
      await this.unitService.create(this._id, this.unit).toPromise();
      new Notification().showSuccess('Unidades registradas exitosamente');
      this.close();
    } catch (err) {
      ErrorHandler.showError(err);
    }
  }
}
