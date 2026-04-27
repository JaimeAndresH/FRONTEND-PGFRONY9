import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { CatalogService, ViewName } from './service.model';
import { ServiceCardComponent } from './service-card.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [NgFor, NgIf, ServiceCardComponent],
  template: `
    <main class="inner-page">
      <section class="page-hero">
        <div class="container">
          <span class="section-heading__tag">localStorage</span>
          <h1>Servicios favoritos</h1>
          <p>Los servicios guardados se conservan en el navegador, incluyendo los servicios creados localmente.</p>
        </div>
      </section>

      <section class="section">
        <div class="container favorites-layout">
          <aside class="favorites-summary">
            <span class="section-heading__tag">Resumen</span>
            <h2>{{ favoriteServices.length }} favorito{{ favoriteServices.length === 1 ? '' : 's' }}</h2>
            <p>{{ summaryText }}</p>

            <div class="favorites-summary__count">
              <strong>{{ favoriteServices.length }}</strong>
              <span>servicios guardados</span>
            </div>

            <div class="favorites-summary__actions">
              <button class="button button--primary" type="button" (click)="viewChange.emit('servicios')">Ver catalogo</button>
              <button class="button button--secondary" type="button" [disabled]="!favoriteServices.length" (click)="clearFavorites.emit()">Limpiar favoritos</button>
            </div>
          </aside>

          <section class="favorites-content">
            <div class="favorites-toolbar">
              <div>
                <span class="section-heading__tag">Listado</span>
                <p>Tarjetas recuperadas desde los ids almacenados.</p>
              </div>
            </div>

            <div class="cards-grid" *ngIf="favoriteServices.length; else emptyFavorites">
              <app-service-card
                *ngFor="let service of favoriteServices"
                [service]="service"
                [selected]="true"
                (favoriteChange)="favoriteChange.emit($event)"
              />
            </div>

            <ng-template #emptyFavorites>
              <div class="empty-state">Todavia no tienes favoritos. Ve al catalogo y guarda algun servicio.</div>
            </ng-template>
          </section>
        </div>
      </section>
    </main>
  `
})
export class FavoritesComponent {
  /** Catalogo completo usado para resolver los ids guardados en favoritos. */
  @Input({ required: true }) services: CatalogService[] = [];
  @Input() favorites: string[] = [];

  @Output() favoriteChange = new EventEmitter<string>();
  @Output() clearFavorites = new EventEmitter<void>();
  @Output() viewChange = new EventEmitter<ViewName>();

  /** Servicios cuyo id existe en la lista persistida de favoritos. */
  get favoriteServices(): CatalogService[] {
    return this.services.filter((service) => this.favorites.includes(service.id));
  }

  get summaryText(): string {
    return this.favoriteServices.length
      ? 'Puedes quitar servicios desde la tarjeta o limpiar toda la lista.'
      : 'Tus favoritos apareceran aqui cuando los guardes desde el catalogo.';
  }
}
