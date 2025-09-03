import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-my-chart',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent {
  selectedYear: string = '';
  selectedMonth: string = '';
  years: string[] = ['2022', '2023'];
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  private originalData: { [year: string]: number[] } = {
    '2022': [65, 59, 80, 81, 56, 55, 40],
    '2023': [75, 49, 60, 91, 66, 45, 50]
  };

  get availableMonths(): string[] {
    return this.selectedYear ? this.months : [];
  }

  constructor(private http: HttpClient) { }

  public chartType: ChartType = 'bar';
  public chartOptions: ChartOptions = {
    responsive: true,
  };
  chartData: ChartData<'bar'> = {
    labels: this.months,
    datasets: [
      { data: [...this.originalData['2022'], ...this.originalData['2023']], label: 'Series A' }
    ]
  };
  chartLegend = true;

  filterChart() {
    if (!this.selectedYear) {
      const allData = Object.values(this.originalData).flat();
      this.chartData = {
        labels: this.months.concat(this.months),
        datasets: [
          { data: allData, label: 'Series A' }
        ]
      };
    } else if (!this.selectedMonth) {
      this.chartData = {
        labels: this.months,
        datasets: [
          { data: [...this.originalData[this.selectedYear]], label: 'Series A' }
        ]
      };
    } else {
      const idx = this.months.indexOf(this.selectedMonth);
      this.chartData = {
        labels: [this.selectedMonth],
        datasets: [
          { data: [this.originalData[this.selectedYear][idx]], label: 'Series A' }
        ]
      };
    }
  }
}