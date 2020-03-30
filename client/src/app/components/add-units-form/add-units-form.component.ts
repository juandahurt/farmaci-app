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
import { UnitSharedService } from 'src/services/unit.shared.service';

@Component({
  selector: 'app-add-units-form',
  templateUrl: './add-units-form.component.html',
  styleUrls: ['./add-units-form.component.less']
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

  /**
   * Unidades del producto
   */
  public units: Array<Unit>;

  constructor(
    private modalService: NgbModal,
    private productService: ProductService,
    private route: ActivatedRoute,
    private unitService: UnitService,
    private unitSharedSerevice: UnitSharedService
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
  public open(content: any) {
    this.modalService.open(content, { centered: true });
  }

  /**
   * Cierra el formulario
   */
  public close() {
    this.modalService.dismissAll(null);
  }

  /**
   * Obtiene y setea las unidades del producto
   */
  private async setUnits() {
    try {
      let res = await this.unitService.list(this.product.id).toPromise();
      let units = res as Array<any>;
      this.units = new Array<Unit>();
      
      units.forEach(unit => {
        let u = new Unit().fromJSON(unit);
        this.units.push(u);
      });
    } catch(err) {
      ErrorHandler.showError(err);
    }
  }

  /**
   * Invacada al dar click en Agregar
   */
  public async addOnClick() {
    try {
      await this.unitService.create(this._id, this.unit).toPromise();
      new Notification().showSuccess('Unidades registradas exitosamente');
      this.close();
      await this.setUnits();
      this.unitSharedSerevice.changeUnits(this.units);
    } catch (err) {
      ErrorHandler.showError(err);
    }
  }
}
