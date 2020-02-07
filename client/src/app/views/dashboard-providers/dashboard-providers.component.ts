import { Component, OnInit } from '@angular/core';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ProviderService } from 'src/services/provider.service';
import { ErrorHandler } from 'src/helpers/error.helper';
import { Provider } from 'src/models/provider';
import { Notification } from 'src/helpers/notification.helper';
import { ConfirmForm } from 'src/helpers/confirm-form.helper';

@Component({
  selector: 'app-dashboard-providers',
  templateUrl: './dashboard-providers.component.html',
  styleUrls: ['./dashboard-providers.component.css']
})
export class DashboardProvidersComponent implements OnInit {
  /**
   * Icono de Eliminar Proveedor
   */
  public faTrashAlt = faTrashAlt;

  /**
   * Proveedores registrados
   */
  public providers: Array<Provider>;

  /**
   * Nombre de proveedor a registrar
   */
  public name: string;

  /**
   * Página actual
   */
  public page: number;

  /**
   * Tamaño de cada página
   */
  public pageSize: number;

  /**
   * Tamaño de la lista
   */
  public collectionSize: number;

  public isLoading: boolean;

  constructor(private providerService: ProviderService) { 
    this.isLoading = true;
    this.getProviders().then(() => {
      this.page = 1;
      this.pageSize = 5;
      this.collectionSize = this.providers.length;
      this.isLoading = false;
    }).catch((err) => { this.isLoading = false; });
  }

  ngOnInit() {
  }

  /**
   * Obtiene y setea los proveedores registrados
   */
  private async getProviders() {
    try {
      let res: any = await this.providerService.list().toPromise();

      if (res.length > 0) {
        this.providers = new Array<Provider>();
        res.forEach(provider => {
          this.providers.push(new Provider().fromJSON(provider));
        });
      } else {
        this.providers = null;
      }
    } catch(err) {
      ErrorHandler.showError(err);
    }
  }

  /**
   * Invocada al dar click en Agregar
   */
  public async addProviderOnClick() {
    try {
      var provider = new Provider();
      provider.name = this.name;

      let res = await this.providerService.create(provider).toPromise();

      if (this.providers == null) { this.providers = new Array<Provider>(); }
      this.providers.push(new Provider().fromJSON(res));

      new Notification().showSuccess('Proveedor agregado exitosamente');
    } catch (err) {
      ErrorHandler.showError(err);
    }
  }

  /**
   * Invocada al hacer click en Eliminar
   * @param id Identificador del proveedor
   */
  public async deleteProviderOnClick(id: number) {
    try {
      let res = await new ConfirmForm().show('¿Está seguro?', 'El proveedor será eliminado de forma permanente');
      if (res.value) { await this.providerService.delete(id).toPromise(); }
    } catch (err) {
      ErrorHandler.handleError(err, 'Proveedor eliminado exitosamente');
      if (err.status == 200) { this.getProviders(); }
    }
  }
}
