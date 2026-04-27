import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CatalogService } from './service.model';

@Component({
  selector: 'app-service-card',
  standalone: true,
  template: `
    <article class="service-card">
      <div class="service-card__media">
        <img [src]="service.image" [alt]="service.name">
        <span class="service-card__badge">{{ service.badge }}</span>
        <button
          class="service-card__favorite"
          type="button"
          [class.is-active]="selected"
          [attr.aria-label]="selected ? 'Quitar de favoritos' : 'Agregar a favoritos'"
          (click)="favoriteChange.emit(service.id)"
        >
          {{ selected ? '♥' : '♡' }}
        </button>
      </div>
      <div class="service-card__content">
        <div class="service-card__meta">
          <span>{{ service.category }}</span>
          <span>{{ service.mode }}</span>
        </div>
        <h3>{{ service.name }}</h3>
        <p>{{ service.description }}</p>
        <div class="service-card__actions">
          <button class="service-card__link" type="button" (click)="favoriteChange.emit(service.id)">
            {{ selected ? 'Guardado' : 'Guardar' }}
          </button>
          <span>{{ service.price }}</span>
        </div>
      </div>
    </article>
  `
})
export class ServiceCardComponent {
  @Input({ required: true }) service!: CatalogService;
  @Input() selected = false;
  @Output() favoriteChange = new EventEmitter<string>();
}
