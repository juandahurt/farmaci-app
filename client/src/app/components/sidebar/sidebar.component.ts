import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faHome, faCubes, faProjectDiagram, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

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
   * url activa
   */
  public url: string;

  /**
   * ¿El usuario se encuentra dentro del inicio?
   */
  public userInHome: boolean;

  /**
   * ¿El usuario se encuentra dentro de las categorías?
   */
  public userInCategories: boolean;

  /**
   * ¿El usuario se encuentra dentro de los productos?
   */
  public userInProducts: boolean;

  /**
   * ¿El usuario se encuentra dentro del carrito de ventas?
   */
  public userInSellingCart: boolean;

  constructor(private router: Router) { 
    this.url = router.url;
    
    switch (this.url) {
      case "/home":
        this.userInHome = true;
        break;
      case "/categories":
        this.userInCategories = true;
        break;
      case "/products":
        this.userInProducts = true;
        break;
      case "/selling-cart":
        this.userInSellingCart = true;
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
}
