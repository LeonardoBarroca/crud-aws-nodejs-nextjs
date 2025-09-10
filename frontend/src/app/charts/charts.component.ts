import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-my-chart',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent {
  selectedCountry: string = '';
  selectedState: string = '';
  countries: string[] = ['USA', 'Brazil', 'India'];
  statesByCountry: { [country: string]: string[] } = {
    'USA': ['California', 'Texas', 'New York'],
    'Brazil': ['São Paulo', 'Rio de Janeiro', 'Bahia'],
    'India': ['Maharashtra', 'Karnataka', 'Tamil Nadu']
  };
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  private originalData: { [country: string]: { [state: string]: number[] } } = {
    'USA': {
      'California': [65, 59, 80, 81, 56, 55, 40],
      'Texas': [75, 49, 60, 91, 66, 45, 50],
      'New York': [55, 69, 70, 61, 76, 35, 60]
    },
    'Brazil': {
      'São Paulo': [45, 39, 60, 71, 46, 35, 30],
      'Rio de Janeiro': [55, 59, 50, 61, 56, 25, 40],
      'Bahia': [35, 49, 40, 51, 36, 15, 20]
    },
    'India': {
      'Maharashtra': [85, 79, 90, 81, 86, 75, 70],
      'Karnataka': [65, 59, 80, 71, 66, 55, 60],
      'Tamil Nadu': [75, 69, 60, 91, 76, 65, 50]
    }
  };

  get availableStates(): string[] {
    return this.selectedCountry ? this.statesByCountry[this.selectedCountry] : [];
  }

  constructor(private http: HttpClient) { }

  public chartType: ChartType = 'bar';
  public chartOptions: ChartOptions = {
    responsive: true,
  };
  chartData: ChartData<'bar'> = {
    labels: this.months,
    datasets: [
      ...Object.entries(this.originalData).flatMap(([country, states]) =>
        Object.entries(states).map(([state, data]) => ({
          data: [...data],
          label: `${state} (${country})`
        }))
      )
    ]
  };
  chartLegend = true;

  filterChart() {
    if (!this.selectedCountry) {
      this.chartData = {
        labels: this.months,
        datasets: [
          ...Object.entries(this.originalData).flatMap(([country, states]) =>
            Object.entries(states).map(([state, data]) => ({
              data: [...data],
              label: `${state} (${country})`
            }))
          )
        ]
      };
    } else if (!this.selectedState) {
      this.chartData = {
        labels: this.months,
        datasets: [
          ...Object.entries(this.originalData[this.selectedCountry]).map(([state, data]) => ({
            data: [...data],
            label: state
          }))
        ]
      };
    } else {
      const data = this.originalData[this.selectedCountry][this.selectedState];
      this.chartData = {
        labels: this.months,
        datasets: [
          { data: [...data], label: this.selectedState }
        ]
      };
    }
  }

  async getJsonFile() {
    try {
      const response = await lastValueFrom(this.http.get('/assets/data/synthetic_data_large.json'));
      console.log('Arquivo JSON buscado com sucesso:', response);
    } catch (error) {
      console.log('Erro ao buscar arquivo JSON:', error);
    }
  }
}

