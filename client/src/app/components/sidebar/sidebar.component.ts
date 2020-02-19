import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faHome, faCubes, faProjectDiagram, faShoppingCart, faMoneyBill, faArrowDown, faArrowUp, faTruck, faBell } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/services/notification.service';
import { Notification } from 'src/helpers/notification.helper';

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
   * Icono de Notificaciones
   */
  public faBell = faBell;

  /**
   * ¿El usuario se encuentra en el inicio?
   */
  public static userAtHome = true;

  /**
   * ¿El usuario se encuentra en las categorías?
   */
  public static userAtCategories: boolean;

  /**
   * ¿El usuario se encuentra enlos productos?
   */
  public static userAtProducts: boolean;

  /**
   * ¿El usuario se encuentra en el carrito de ventas?
   */
  public static userAtSellingCart: boolean;

  /** 
   * ¿El usuario se encuentra en las notificaciones?
  */
 public static userAtNotifications: boolean;

  /** 
   * ¿El usuario se encuentra en los egresos?
  */
  public static userAtExpenses: boolean;

  /** 
   * ¿El usuario se encuentra en los proveedores?
  */
 public static userAtProviders: boolean;

  /**
   * Controla el submenú de los egresos
   */
  public isCollapsed = true;

  public classRef = SidebarComponent;

  constructor(private notificationService: NotificationService) { } 

  ngOnInit() {
    this.notificationService.get().toPromise().then((notifications:any) => {
      if (notifications.length > 0) {
        new Notification().showAlert("¡Tienes notificaciones!");
      }
    });
  }

  /**
   * Es invocada al dar click en Productos
   */
  public static homeOnClick() {
    this.setFalse();
    this.userAtHome = true;
  }

  /**
   * Es invocada al dar click en Productos
   */
  public static productsOnClick() {
    this.setFalse();
    this.userAtProducts = true;
  }

  /**
   * Es invocada al dar click en Categorías
   */
  public static categoriesOnClick() {
    this.setFalse();
    this.userAtCategories = true;
  }

  /**
   * Es invocada al dar click en Carrito
   */
  public static sellingCartOnClick() {
    this.setFalse();
    this.userAtSellingCart = true;
  }

  /**
   * Es invocada al dar click en Notificaciones
   */
  public static notificationsOnClick() {
    this.setFalse();
    this.userAtNotifications = true;
  }

  /**
   * Es invocada al dar click en Egresos
   */
  public static expensesOnClick() {
    this.setFalse();
    this.userAtExpenses = true;
  }

  /**
   * Es invocada al dar click en Proveedores
   */
  public static providersOnClick() {
    this.setFalse();
    this.userAtProviders = true;
  }

  /**
   * Coloca false en todas las rutas
   */
  public static setFalse() {
    this.userAtHome = false;
    this.userAtCategories = false;
    this.userAtProducts = false;
    this.userAtSellingCart = false;
    this.userAtExpenses = false;
    this.userAtProviders = false;
    this.userAtNotifications = false;
  }
}
