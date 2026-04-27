import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { AdminComponent } from './admin.component';
import { CatalogDataService } from './catalog-data.service';
import { ServiceForm, ViewName } from './service.model';
import { ContactComponent } from './contact.component';
import { ContactDataService } from './contact-data.service';
import { FavoritesComponent } from './favorites.component';
import { HeaderComponent } from './header.component';
import { HomeComponent } from './home.component';
import { ServicesListComponent } from './services-list.component';
import { STORAGE_KEYS } from './storage-keys';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgIf,
    HeaderComponent,
    HomeComponent,
    ServicesListComponent,
    FavoritesComponent,
    ContactComponent,
    AdminComponent
  ],
  template: `
    <app-header
      [appName]="appName"
      [currentView]="currentView"
      (viewChange)="currentView = $event"
    />

    <app-home
      *ngIf="currentView === 'inicio'"
      [featuredServices]="catalog.featuredServices"
      [favorites]="favorites"
      (favoriteChange)="toggleFavorite($event)"
      (viewChange)="currentView = $event"
    />

    <app-services-list
      *ngIf="currentView === 'servicios'"
      [services]="catalog.services()"
      [favorites]="favorites"
      (favoriteChange)="toggleFavorite($event)"
    />

    <app-favorites
      *ngIf="currentView === 'favoritos'"
      [services]="catalog.services()"
      [favorites]="favorites"
      (favoriteChange)="toggleFavorite($event)"
      (clearFavorites)="clearFavorites()"
      (viewChange)="currentView = $event"
    />

    <app-contact
      *ngIf="currentView === 'contacto'"
      [services]="catalog.services()"
    />

    <app-admin
      *ngIf="currentView === 'administrar'"
      [customServices]="catalog.customServices()"
      (createService)="addService($event)"
      (clearServices)="catalog.clearCustomServices()"
    />

    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <button class="brand brand--footer footer-brand" type="button" (click)="currentView = 'inicio'">
            <span class="brand__logo">CP</span>
            <span class="brand__text">{{ appName }}</span>
          </button>
          <p>Implementacion basica en Angular con componentes, binding y datos locales.</p>
        </div>
        <div>
          <h3>Binding</h3>
          <ul class="footer-list">
            <li>Interpolacion</li>
            <li>Property y class binding</li>
            <li>Event binding</li>
            <li>Two-way binding</li>
          </ul>
        </div>
        <div>
          <h3>Estado</h3>
          <ul class="footer-list">
            <li>{{ catalog.services().length }} servicios cargados</li>
            <li>{{ favorites.length }} favoritos guardados</li>
            <li>{{ contacts.contacts().length }} contactos guardados</li>
          </ul>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer-brand {
      border: 0;
      background: transparent;
      cursor: pointer;
      padding: 0;
    }
  `]
})
export class AppComponent {
  appName = 'CatalogoPlus';
  currentView: ViewName = 'inicio';
  favorites = this.getFavorites();

  constructor(
    readonly catalog: CatalogDataService,
    readonly contacts: ContactDataService
  ) {}

  /**
   * Agrega o quita un servicio de favoritos y sincroniza localStorage.
   */
  toggleFavorite(serviceId: string): void {
    this.favorites = this.favorites.includes(serviceId)
      ? this.favorites.filter((id) => id !== serviceId)
      : [...this.favorites, serviceId];

    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(this.favorites));
  }

  /**
   * Recibe servicios creados desde Administrar y vuelve al catalogo.
   */
  addService(service: ServiceForm): void {
    this.catalog.addService(service);
    this.currentView = 'servicios';
  }

  clearFavorites(): void {
    this.favorites = [];
    localStorage.removeItem(STORAGE_KEYS.favorites);
  }

  private getFavorites(): string[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) ?? '[]') as string[];
    } catch {
      return [];
    }
  }
}
