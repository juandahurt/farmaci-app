import { Component, OnInit, QueryList, ViewChildren, Directive, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ProductService } from 'src/services/product.service';
import { Product } from 'src/models/product';
import { Category } from 'src/models/category';

export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };
export const compare = (v1, v2) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {

  @Input() sortable: string;
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}

@Component({
  selector: 'app-dashboard-products',
  templateUrl: './dashboard-products.component.html',
  styleUrls: ['./dashboard-products.component.css']
})
export class DashboardProductsComponent implements OnInit {
  /**
   * Icono de Buscar
   */
  public faSearch = faSearch;

  /**
   * Formulario de buúsqueda
   */
  private searchForm: FormGroup;

  /**
   * Productos registrados ordernados
   */
  public products: Array<Product>;

  /**
   * Productos registrados sin ordenar
   */
  private PRODUCTS: Array<Product>;


  constructor(private formBuilder: FormBuilder, private productService: ProductService) {
    this.searchForm = this.formBuilder.group({
      id: ['', Validators.required]
    });
    this.setProducts().then(() => {
      this.products = this.PRODUCTS;  
    });
  } 

  ngOnInit() {
  }

  /**
   * Obtiene y setea los productos registrados
   */
  public async setProducts() {
    let res = await this.productService.list().toPromise();
    let products = res as Array<any>;
    this.PRODUCTS = new Array<Product>();

    products.forEach(product => {
      let p = new Product();
      p.id = product.id;
      p.description = product.description;
      if (!product.category) {
        // El producto no tiene categoría
        let cat = new Category();
        cat.name = "";
        p.category = cat;
      } else {
        p.category = new Category().fromJSON(product.category);
      }

      this.PRODUCTS.push(p);
    });
  }

  /**
   * Para acceder más facilmente al formulario
   */
  get f() { return this.searchForm.controls; }

  /**
   * Invocada al dar click en un producto
   */
  public productOnClick(id: string) {
    // TODO: Redirigir a vista del producto
  }

  /**
   * Invocada al hacer Submit en el formulario de búsqueda 
   */
  public searchOnClick() {
    // TODO: Buscar y regidigir a vista del producto
  }


  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  /**
   * Ordena la tabla
   */
  onSort({column, direction}: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '') {
      this.products = this.PRODUCTS;
    } else {
      // Ordena los productos
      this.products = [...this.PRODUCTS].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}
