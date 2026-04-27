import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor } from '@angular/common';
import { CatalogService, ViewName } from './service.model';
import { ServiceCardComponent } from './service-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, ServiceCardComponent],
  template: `
    <section class="hero">
      <div class="container hero__content">
        <div class="hero__text">
          <span class="eyebrow">Implementacion basica en Angular</span>
          <h1>{{ title }}</h1>
          <p>{{ description }}</p>
          <div class="hero__actions">
            <button class="button button--primary" type="button" (click)="viewChange.emit('servicios')">Explorar servicios</button>
            <button class="button button--ghost" type="button" (click)="viewChange.emit('administrar')">Crear servicio</button>
          </div>
        </div>

        <div class="hero__card">
          <p class="hero__card-label">Bindings usados</p>
          <h2>{{ selectedCount }} favorito{{ selectedCount === 1 ? '' : 's' }}</h2>
          <p>Esta vista usa interpolacion, property binding, class binding, event binding y listas renderizadas con Angular.</p>
          <ul class="hero__list">
            <li *ngFor="let item of bindingExamples">{{ item }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="stats">
      <div class="container stats__grid">
        <article class="stat-card" *ngFor="let stat of stats">
          <span class="stat-card__icon">{{ stat.icon }}</span>
          <strong>{{ stat.value }}</strong>
          <p>{{ stat.label }}</p>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-heading">
          <span class="section-heading__tag">Componentes</span>
          <h2>Servicios destacados</h2>
          <p>Cada tarjeta es un componente hijo que recibe datos con Input y comunica acciones con Output.</p>
        </div>

        <div class="cards-grid">
          <app-service-card
            *ngFor="let service of featuredServices"
            [service]="service"
            [selected]="favorites.includes(service.id)"
            (favoriteChange)="favoriteChange.emit($event)"
          />
        </div>
      </div>
    </section>
  `
})
export class HomeComponent {
  @Input({ required: true }) featuredServices: CatalogService[] = [];
  @Input() favorites: string[] = [];
  @Output() favoriteChange = new EventEmitter<string>();
  @Output() viewChange = new EventEmitter<ViewName>();

  title = 'CatalogoPlus con componentes y binding';
  description = 'Una version Angular del catalogo para mostrar datos dinamicos, eventos y formularios enlazados.';
  bindingExamples = ['{{ interpolacion }} para textos', '[propiedad] para imagenes y clases', '(evento) para acciones del usuario', '[(ngModel)] para formularios'];
  stats = [
    { icon: '01', value: '4', label: 'componentes principales' },
    { icon: '02', value: 'JSON', label: 'datos cargados con HttpClient' },
    { icon: '03', value: 'ngModel', label: 'formulario con two-way binding' },
    { icon: '04', value: 'localStorage', label: 'favoritos persistentes' }
  ];

  get selectedCount(): number {
    return this.favorites.length;
  }
}
