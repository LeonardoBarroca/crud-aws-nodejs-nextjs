import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-my-chart',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent {
  selectedCountry: string = '';
  selectedState: string = '';
  countries: string[] = [];
  statesByCountry: { [country: string]: string[] } = {};
  months: string[] = [];

  private loadedData: any[] = [];

  get availableStates(): string[] {
    return this.selectedCountry ? this.statesByCountry[this.selectedCountry] || [] : [];
  }

  constructor(private http: HttpClient) {
    this.loadJsonData();
  }

  loadJsonData() {
    this.isLoading = true;
    this.http.get<any[]>('/assets/data/synthetic_data_large.json').subscribe({
      next: (response) => {
        this.loadedData = response;
        this.processLoadedData();
        this.filterChart();
        this.isLoading = false;
      },
      error: (error) => {
        console.log('Erro ao buscar arquivo JSON:', error);
        this.isLoading = false;
      }
    });
  }

  filterAndSumData(filtered: any[]): { sum: number, filtered: any[] } {
    const sum = filtered.reduce((acc, row) => acc + (row.value || 0), 0);
    console.log('Filtered data:', filtered, 'Sum of values:', sum);
    return { sum, filtered };
  }

  public chartType: ChartType = 'bar';
  public chartOptions: ChartOptions = {
    responsive: true,
  };
  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };
  chartLegend = true;
  totalValue: number = 0;
  isLoading: boolean = false;

  processLoadedData() {
    // Extract unique countries, states, and months
    const countriesSet = new Set<string>();
    const statesByCountry: { [country: string]: Set<string> } = {};
    const monthsSet = new Set<string>();
    for (const row of this.loadedData) {
      countriesSet.add(row.country);
      if (!statesByCountry[row.country]) statesByCountry[row.country] = new Set();
      statesByCountry[row.country].add(row.state);
      monthsSet.add(row.month);
    }
    this.countries = Array.from(countriesSet);
    this.statesByCountry = {};
    for (const country of this.countries) {
      this.statesByCountry[country] = Array.from(statesByCountry[country] || []);
    }
    this.months = Array.from(monthsSet);
    // Optionally, sort months if needed
    const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    this.months.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
  }

  filterChart() {
    console.log('Filtering chart with', { country: this.selectedCountry, state: this.selectedState });
    if (!this.loadedData.length) return;
    let filtered = this.loadedData;
    if (this.selectedCountry) {
      filtered = filtered.filter(row => row.country === this.selectedCountry);
    }
    if (this.selectedState) {
      filtered = filtered.filter(row => row.state === this.selectedState);
    }

    const { sum, filtered: filteredData } = this.filterAndSumData(filtered);
    this.totalValue = sum;
    // Group by state (or by country if no state selected)
    const groupBy = this.selectedState ? ['state'] : (this.selectedCountry ? ['state'] : ['country', 'state']);
    const groupMap: { [label: string]: { [month: string]: number } } = {};
    for (const row of filteredData) {
      const label = groupBy.map(k => row[k]).join(' - ');
      if (!groupMap[label]) groupMap[label] = {};
      groupMap[label][row.month] = row.value;
    }
    const datasets = Object.entries(groupMap).map(([label, monthMap]) => ({
      label,
      data: this.months.map(m => monthMap[m] ?? 0)
    }));
    this.chartData = {
      labels: this.months,
      datasets
    };
  }
}

