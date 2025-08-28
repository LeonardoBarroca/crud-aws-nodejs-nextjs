import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  baseUrl = environment.baseUrl;
  apiPath = `${this.baseUrl}/employees`;

  items: any[] = [];
  model: any = { name: '', description: '' };
  editing: any = null;
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;
    this.http.get<any[]>(this.apiPath)
      .subscribe(
        data => { this.items = data || []; this.loading = false; },
        err => { this.error = 'Erro ao carregar itens'; this.loading = false; }
      );
  }

  submit() {
    this.error = null;
    if (this.editing) {
      // update
      this.http.put(`${this.apiPath}/${this.editing.id}`, this.model)
        .subscribe(
          () => { this.load(); this.reset(); },
          () => { this.error = 'Erro ao atualizar item'; }
        );
    } else {
      // create
      this.http.post(this.apiPath, this.model)
        .subscribe(
          () => { this.load(); this.reset(); },
          () => { this.error = 'Erro ao criar item'; }
        );
    }
  }

  edit(item: any) {
    this.editing = item;
    this.model = { ...item };
  }

  remove(item: any) {
    if (!confirm(`Excluir "${item.name}"?`)) { return; }
    this.http.delete(`${this.apiPath}/${item.id}`)
      .subscribe(
        () => this.load(),
        () => { this.error = 'Erro ao excluir item'; }
      );
  }

  reset() {
    this.editing = null;
    this.model = { name: '', description: '' };
  }
}
