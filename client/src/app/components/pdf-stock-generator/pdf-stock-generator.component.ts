import { Component, OnInit } from '@angular/core';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { Product } from 'src/models/product';
import { ProductService } from 'src/services/product.service';
import { ErrorHandler } from 'src/helpers/error.helper';

@Component({
  selector: 'app-pdf-stock-generator',
  templateUrl: './pdf-stock-generator.component.html',
  styleUrls: ['./pdf-stock-generator.component.less']
})
export class PdfStockGeneratorComponent implements OnInit {
  /**
   * Icono del boton
   */
  public faFilePdf = faFilePdf;

  /**
   * Productos en bodega
   */
  private products: Array<Product>;

  constructor(private productService: ProductService) { 
    this.getProducts();
  }

  ngOnInit() {
  }

  /**
   * Obtiene los productos en bodega
   */
  private async getProducts() {
    try {
      this.products = new Array<Product>();
      let res: any = await this.productService.list().toPromise();
      res.forEach(p => {
        this.products.push(new Product().fromJSON(p));
      });
    } catch (err) {
      ErrorHandler.showError(err);
    }
  }

  /**
   * Genera un pdf con todo el stock
   */
  public generatePdf() {
    let docDef = this.getDocumentDefinition();
    pdfMake.createPdf(docDef).download();
  }

  /**
   * Retorna la definición del documento
   */
  private getDocumentDefinition() {
    return {
      content: [
        {
          text: 'Productos en bodega',
          style: 'header'
        },
        {
          table: {
            widths: ['*', '*', '*', '*', '*'],
            body: [
              [{
                text: 'Identificador',
                style: 'tableHeader',
                bold: true
              },
              {
                text: 'Descripción',
                style: 'tableHeader',
                bold: true
              },
              {
                text: 'Cajas',
                style: 'tableHeader',
                bold: true
              },
              {
                text: 'Sobres',
                style: 'tableHeader',
                bold: true
              },
              {
                text: 'Unidades',
                style: 'tableHeader',
                bold: true
              }],
              ...this.products.map(p => {
                return [p.id, p.description, p.boxQuantity, p.otherQuantity, p.unitQuantity];
              })
            ]
          }
        },
      ]
    }
  }
}
