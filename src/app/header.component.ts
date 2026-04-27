import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ViewName } from './service.model';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="site-header">
      <div class="container nav-wrapper">
        <button class="brand brand-button" type="button" (click)="viewChange.emit('inicio')">
          <span class="brand__logo">CP</span>
          <span class="brand__text">{{ appName }}</span>
        </button>

        <button class="nav-toggle" type="button" aria-label="Abrir menu" (click)="menuOpen = !menuOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav class="site-nav" [class.is-open]="menuOpen">
          <button
            class="nav-link"
            type="button"
            [class.nav-link--active]="currentView === 'inicio'"
            (click)="selectView('inicio')"
          >
            Inicio
          </button>
          <button
            class="nav-link"
            type="button"
            [class.nav-link--active]="currentView === 'servicios'"
            (click)="selectView('servicios')"
          >
            Servicios
          </button>
          <button
            class="nav-link"
            type="button"
            [class.nav-link--active]="currentView === 'favoritos'"
            (click)="selectView('favoritos')"
          >
            Favoritos
          </button>
          <button
            class="nav-link"
            type="button"
            [class.nav-link--active]="currentView === 'contacto'"
            (click)="selectView('contacto')"
          >
            Contacto
          </button>
          <button
            class="nav-link"
            type="button"
            [class.nav-link--active]="currentView === 'administrar'"
            (click)="selectView('administrar')"
          >
            Administrar
          </button>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .brand-button,
    .nav-link {
      border: 0;
      background: transparent;
      cursor: pointer;
    }
  `]
})
export class HeaderComponent {
  @Input({ required: true }) appName = '';
  @Input({ required: true }) currentView: ViewName = 'inicio';
  @Output() viewChange = new EventEmitter<ViewName>();

  menuOpen = false;

  selectView(view: ViewName): void {
    this.menuOpen = false;
    this.viewChange.emit(view);
  }
}
