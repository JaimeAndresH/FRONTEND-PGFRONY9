import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { CatalogService } from './service.model';
import { ServiceCardComponent } from './service-card.component';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [NgFor, NgIf, ServiceCardComponent],
  template: `
    <main class="inner-page">
      <section class="page-hero">
        <div class="container">
          <span class="section-heading__tag">Catalogo Angular</span>
          <h1>Servicios disponibles</h1>
          <p>Filtra por categoria y guarda servicios como favoritos usando binding de eventos y propiedades.</p>

          <div class="view-tabs">
            <button
              class="button view-tab"
              type="button"
              [class.is-active]="activeCategory === 'Todos'"
              (click)="activeCategory = 'Todos'"
            >
              Todos
            </button>
            <button
              class="button view-tab"
              type="button"
              *ngFor="let category of categories"
              [class.is-active]="activeCategory === category"
              (click)="activeCategory = category"
            >
              {{ category }}
            </button>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <p class="angular-note">{{ filteredServices.length }} servicio{{ filteredServices.length === 1 ? '' : 's' }} visible{{ filteredServices.length === 1 ? '' : 's' }}</p>

          <div class="cards-grid" *ngIf="filteredServices.length; else emptyState">
            <app-service-card
              *ngFor="let service of filteredServices"
              [service]="service"
              [selected]="favorites.includes(service.id)"
              (favoriteChange)="favoriteChange.emit($event)"
            />
          </div>

          <ng-template #emptyState>
            <div class="empty-state">No hay servicios para esta categoria.</div>
          </ng-template>
        </div>
      </section>
    </main>
  `
})
export class ServicesListComponent {
  @Input({ required: true }) services: CatalogService[] = [];
  @Input() favorites: string[] = [];
  @Output() favoriteChange = new EventEmitter<string>();

  activeCategory = 'Todos';

  get categories(): string[] {
    return [...new Set(this.services.map((service) => service.category))];
  }

  get filteredServices(): CatalogService[] {
    if (this.activeCategory === 'Todos') {
      return this.services;
    }

    return this.services.filter((service) => service.category === this.activeCategory);
  }
}
