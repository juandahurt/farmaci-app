import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faHome, faCubes, faProjectDiagram, faShoppingCart, faMoneyBill, faArrowDown, faArrowUp, faTruck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  /**
   * Icono de Inicio
   */
  public faHome = faHome;

  /**
   * Icono de Productos
   */
  public faCubes = faCubes;

  /**
   * Icono de Categorías
   */
  public faProjectDiagram = faProjectDiagram;

  /**
   * Icono de Carrito
   */
  public faShoppingCart = faShoppingCart;

  /**
   * Icono de submenu Egresos cuando isCollapse = true
   */
  public faArrowDown = faArrowDown;

  /**
   * Icono de submenu Egresos cuando isCollapse = false
   */
  public faArrowUp = faArrowUp;

  /**
   * Icono de Egresos
   */
  public faMoneyBill = faMoneyBill;

  /**
   * Icono de Proveedores
   */
  public faTruck = faTruck;

  /**
   * url activa
   */
  public url: string;

  /**
   * ¿El usuario se encuentra en el inicio?
   */
  public userAtHome: boolean;

  /**
   * ¿El usuario se encuentra en las categorías?
   */
  public userAtCategories: boolean;

  /**
   * ¿El usuario se encuentra enlos productos?
   */
  public userAtProducts: boolean;

  /**
   * ¿El usuario se encuentra en el carrito de ventas?
   */
  public userAtSellingCart: boolean;

  /** 
   * ¿El usuario se encuentra en los egresos?
  */
  public userAtExpenses;

  /** 
   * ¿El usuario se encuentra en los proveedores?
  */
 public userAtProviders;

  /**
   * Controla el submenú de los egresos
   */
  public isCollapsed = true;

  constructor(private router: Router) { 
    this.url = router.url;
    
    switch (this.url) {
      case "/":
        this.userAtHome = true;
        break;
      case "/home":
        this.userAtHome = true;
        break;
      case "/categories":
        this.userAtCategories = true;
        break;
      case "/products":
        this.userAtProducts = true;
        break;
      case "/selling-cart":
        this.userAtSellingCart = true;
        break;
      case "/expenses":
        this.userAtExpenses = true;
        break;
      case "/providers":
        this.userAtProviders = true;
        break; 
    }
  } 

  ngOnInit() {
  }

  /**
   * Es invocada al dar click en Productos
   */
  public homeOnClick() {
    this.router.navigateByUrl("home");
  }

  /**
   * Es invocada al dar click en Productos
   */
  public productsOnClick() {
    this.router.navigateByUrl("products");
  }

  /**
   * Es invocada al dar click en Categorías
   */
  public categoriesOnClick() {
    this.router.navigateByUrl("categories");
  }

  /**
   * Es invocada al dar click en Carrito
   */
  public sellingCartOnClick() {
    this.router.navigateByUrl("selling-cart");
  }

  /**
   * Es invocada al dar click en Egresos
   */
  public expensesOnClick() {
    this.router.navigateByUrl("expenses");
  }

  /**
   * Es invocada al dar click en Proveedores
   */
  public providersOnClick() {
    this.router.navigateByUrl("providers");
  }
}
