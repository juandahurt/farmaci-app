import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faBoxes } from '@fortawesome/free-solid-svg-icons';
import { ProductService } from 'src/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { ErrorHandler } from 'src/helpers/error.helper';
import { Product } from 'src/models/product';
import { DimensionService } from 'src/services/dimension.service';
import { Dimension } from 'src/models/dimension';
import { DimensionSharedService } from 'src/services/dimension.shared.service';

@Component({
  selector: 'app-add-dimensions-form',
  templateUrl: './add-dimensions-form.component.html',
  styleUrls: ['./add-dimensions-form.component.less']
})
export class AddDimensionsFormComponent implements OnInit {
  /** 
   * Icono de Ingresar Dimensiones
   */
  public faBoxes = faBoxes;

  /**
   * Identificador del producto
   */
  private _id: string;

  /**
   * Producto al que se le ingresan las dimensiones
   */
  public product: Product;

  /**
   * Dimensiones del producto
   */
  public dimension: Dimension;

  constructor(
    private modalService: NgbModal,
    private productService: ProductService,
    private route: ActivatedRoute,
    private dimensionService: DimensionService,
    private dimensionSharedService: DimensionSharedService
  ) { 
    this._id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
  }

  /**
   * Abre el formulario
   * @param content Contenido del formulario
   */
  public open(content: any) {
    this.modalService.open(content, { centered: true });
    this.getProduct().then(() => {
      this.dimension = new Dimension();
    });
  }

  /**
   * Cierra el formulario
   */
  public close() {
    this.modalService.dismissAll(null);
  }

  /**
   * Obtiene el producto y lo asigna a su correspondiente variable
   */
  private async getProduct() {
    try {
      let res = await this.productService.get(this._id).toPromise();
      this.product = new Product().fromJSON(res);
    } catch (err) {
      ErrorHandler.showError(err);
    }
  }
  
  /**
   * Invocada al dar click en Aceptar
   */
  public async OKOnclick() {
    try {
      await this.dimensionService.create(this._id, this.dimension).toPromise();
    } catch (err) {
      ErrorHandler.handleError(err, 'Cantidad de unidades agregadas exitosamente');
      if (err.status != 422) { 
        this.close(); 
        this.dimensionSharedService.changeHaveBeenSet(true);
        this.dimensionSharedService.changeDimension(this.dimension);
      }
    }
  }
}
