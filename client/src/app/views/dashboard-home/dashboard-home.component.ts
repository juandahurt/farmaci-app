import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { StatsService } from 'src/services/stats.service';
import { ProductSold } from 'src/models/product-sold';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  /**
   * Productos Vendido el día de hoy
   */
  public productsSold;

  /**
   * Para controlar el rango de fecha de las estadísticas
   */
  public dateNumber: number;

  /**
   * DataSet de los ingresos
   */
  profitsDataSet: ChartDataSets[] = [
    { data: [], label: 'Ingresos' },
  ];

  /**
   * DataSet de las ventas
   */
  sellsDataSet: ChartDataSets[] = [
    { data: [], label: 'Ventas' },
  ];

  /**
   * Etiquetas
   */
  profitsLabels: Label[] = [];
  sellsLabels: Label[] = [];

  /**
   * Opciones de las gráficas
   */
  chartOptions = {
    responsive: true,
  };

  /**
   * Gráfico de linea
   */
  lineChartType = 'line';

  /**
   * Colores de la gráfica de ventas
   */
  sellsChartColors: Color[] = [
    {
      backgroundColor: 'rgba(0, 76, 252, 0.28)',
    }
  ];

  lineChartLegend = true;
  lineChartPlugins = [];

  /**
   * Página actual
   */
  public page = 1;

  /**
   * Tamaño de cada página
   */
  public pageSize: number;

  /**
   * Tamaño de la lista
   */
  public collectionSize: number;

  /**
   * ¿El usuario ha hecho una venta?
   */
  public userMadeASell: boolean;

  constructor(private statsService: StatsService) {
    this.dateNumber = 1;
    this.productsSold = new Array();
    this.getStats().then(() => {    
      this.collectionSize = this.productsSold.length;
      this.page = 1;
      this.pageSize = 5;
    });
  }

  ngOnInit() {
  }

  /**
   * Obtiene y setea las estadísticas
   */
  private async getStats() {
    let res: any = await this.statsService.get(this.dateNumber).toPromise();
    
    this.profitsLabels = [];
    this.sellsLabels = [];
    this.profitsDataSet[0].data = [];
    this.sellsDataSet[0].data = [];
    this.productsSold = new Array<ProductSold>();

    res.profits.forEach(profit => {
      this.profitsLabels.push(profit.label);
      this.profitsDataSet[0].data.push(profit.data);
    });
    res.sells.forEach(sell => {
      this.sellsLabels.push(sell.label);
      this.sellsDataSet[0].data.push(sell.data);
    });
    res.productsSoldToday.forEach(productSold => {
      this.productsSold.push(productSold);
    });
    this.userMadeASell = this.productsSold.length > 0;
  }

  /**
   * Invacada al cambiar el rango de fecha
   */
  public dateOnChange() {
    this.getStats();
  }
}
