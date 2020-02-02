import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Label, Color, MultiDataSet } from 'ng2-charts';
import { StatsService } from 'src/services/stats.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardComponent implements OnInit {
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
   * Gráfico en forma de dona
   */
  doughnutChartType = 'doughnut';

  /**
   * Colores de la gráfica de ventas
   */
  sellsChartColors: Color[] = [
    {
      backgroundColor: 'rgba(0, 76, 252, 0.28)',
    }
  ];

  /**
   * Etiquetas de las categorías
   */
  categoriesChartLabels: Label[] = ['Categoría 1', 'Categoría 2', 'Categoría 3'];

  /**
   * DataSet del gráfico de las categorías
   */
  doughnutChartData: MultiDataSet = [
    [55, 25, 20]
  ];

  lineChartLegend = true;
  lineChartPlugins = [];

  constructor(private statsService: StatsService) {
    this.dateNumber = 0;
    this.getStats();
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
    res.profits.forEach(profit => {
      this.profitsLabels.push(profit.label);
      this.profitsDataSet[0].data.push(profit.data);
    });
    res.sells.forEach(sell => {
      this.sellsLabels.push(sell.label);
      this.sellsDataSet[0].data.push(sell.data);
    });
  }

  /**
   * Invacada al cambiar el rango de fecha
   */
  public dateOnChange() {
    this.getStats();
  }
}
