import { Component, OnInit } from '@angular/core';
import { faSearch, faArrowDown, faMoneyBill } from '@fortawesome/free-solid-svg-icons';

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

  constructor() { }

  ngOnInit() {
  }

}
