import { Component, OnInit } from '@angular/core';
import { Notification } from 'src/models/notification';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/services/notification.service';
import { ErrorHandler } from 'src/helpers/error.helper';

@Component({
  selector: 'app-dashboard-notifications',
  templateUrl: './dashboard-notifications.component.html',
  styleUrls: ['./dashboard-notifications.component.less']
})
export class DashboardNotificationsComponent implements OnInit {
  /**
   * Notificaciones
   */
  public notifications: Array<Notification>;

  /**
   * ¿Está cargando la petición?
   */
  public isLoading: boolean;

  /**
   * Icono de Cerrar Notificación
   */
  public faTimes = faTimes

  constructor(private notificationService: NotificationService) { 
    this.getNotifications().then(() => {this.isLoading = false;});
  }

  ngOnInit() { }

  private async getNotifications() {
    try {
      this.isLoading = true;
      let res:any = await this.notificationService.get().toPromise();
      if (res.length > 0) {
        this.notifications = new Array<Notification>();
        res.forEach((notification: any) => {
          this.notifications.push(new Notification().fromJSON(notification))
        });
      }
    } catch (err) {
      this.isLoading = false;
      ErrorHandler.showError(err);
    } 
  }

  /**
   * Invocada al dar click en Cerrar Notifiación
   */
  public async closeOnClick(id: number) {
    try {
      await this.notificationService.delete(id).toPromise();
    } catch (err) {
      if (err.status == 200) {
        if (this.notifications.length == 1) { this.notifications = null; }
        else { this.getNotifications(); }
      }
      ErrorHandler.showError(err);
    }
  }

  /**
   * Invocada al dar click en Cerrar Todas
   */
  public async closeAllOnClick() {
    try {
      await this.notificationService.deleteAll().toPromise();
    } catch (err) {
      if (err.status == 200){ this.notifications = null; }
      ErrorHandler.showError(err);
    }
  }
}
