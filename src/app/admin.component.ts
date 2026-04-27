import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { CatalogService, ServiceForm } from './service.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  template: `
    <main class="inner-page">
      <section class="page-hero">
        <div class="container">
          <span class="section-heading__tag">Two-way binding</span>
          <h1>Gestion basica de servicios</h1>
          <p>El formulario usa [(ngModel)] para mantener sincronizados los campos y la vista previa.</p>
        </div>
      </section>

      <section class="section">
        <div class="container admin-layout">
          <section class="admin-panel">
            <div class="admin-panel__header">
              <span class="section-heading__tag">Nuevo servicio</span>
              <h2>Registrar servicio</h2>
              <p>Completa los datos y agrega una tarjeta al catalogo local.</p>
            </div>

            <form class="admin-form" #serviceForm="ngForm" (ngSubmit)="submitForm(serviceForm.valid ?? false)">
              <div class="form-group">
                <label for="name">Nombre del servicio</label>
                <input id="name" name="name" type="text" required [(ngModel)]="form.name">
              </div>

              <div class="admin-form__grid">
                <div class="form-group">
                  <label for="category">Categoria</label>
                  <select id="category" name="category" required [(ngModel)]="form.category">
                    <option value="">Selecciona una categoria</option>
                    <option value="Educativo">Educativo</option>
                    <option value="Tecnologico">Tecnologico</option>
                    <option value="Turistico">Turistico</option>
                    <option value="Comercial">Comercial</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="mode">Modalidad</label>
                  <select id="mode" name="mode" required [(ngModel)]="form.mode">
                    <option value="">Selecciona una modalidad</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Presencial">Presencial</option>
                    <option value="Hibrido">Hibrido</option>
                    <option value="Experiencial">Experiencial</option>
                  </select>
                </div>
              </div>

              <div class="admin-form__grid">
                <div class="form-group">
                  <label for="price">Precio o tarifa</label>
                  <input id="price" name="price" type="text" required placeholder="Desde $200.000" [(ngModel)]="form.price">
                </div>

                <div class="form-group">
                  <label for="badge">Etiqueta</label>
                  <select id="badge" name="badge" required [(ngModel)]="form.badge">
                    <option value="">Selecciona una etiqueta</option>
                    <option value="Nuevo">Nuevo</option>
                    <option value="Popular">Popular</option>
                    <option value="Destacado">Destacado</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="description">Descripcion corta</label>
                <textarea id="description" name="description" rows="4" required minlength="10" [(ngModel)]="form.description"></textarea>
              </div>

              <label class="check-field" for="featured">
                <input id="featured" name="featured" type="checkbox" [(ngModel)]="form.featured">
                <span>Marcar como servicio destacado</span>
              </label>

              <div class="admin-form__actions">
                <button class="button button--primary" type="submit">Agregar servicio</button>
                <button class="button button--secondary" type="button" (click)="resetForm()">Limpiar formulario</button>
              </div>

              <p class="form-success" [hidden]="!saved">Servicio agregado correctamente al catalogo local.</p>
            </form>
          </section>

          <section class="admin-list">
            <div class="admin-summary">
              <div>
                <span class="section-heading__tag">Vista previa</span>
                <h2>{{ form.name || 'Nuevo servicio' }}</h2>
                <p>{{ form.description || 'La descripcion aparecera aqui mientras escribes.' }}</p>
              </div>
              <div class="admin-summary__stats">
                <strong>{{ form.featured ? 'Si' : 'No' }}</strong>
                <span>destacado</span>
              </div>
            </div>

            <article class="admin-item">
              <div class="admin-item__top">
                <span class="admin-item__badge">{{ form.badge || 'Etiqueta' }}</span>
                <span class="admin-item__featured">{{ form.category || 'Categoria' }}</span>
              </div>
              <strong>{{ form.name || 'Nombre del servicio' }}</strong>
              <p>{{ form.mode || 'Modalidad' }}</p>
              <small>{{ form.price || 'Precio pendiente' }}</small>
            </article>

            <div>
              <div class="admin-list__actions">
                <button class="button button--secondary" type="button" [disabled]="!customServices.length" (click)="clearServices.emit()">Eliminar servicios creados</button>
              </div>

              <div class="contact-list" *ngIf="customServices.length; else emptyCreated">
                <article class="admin-item" *ngFor="let service of customServices">
                  <div class="admin-item__top">
                    <span class="admin-item__badge">{{ service.badge }}</span>
                    <span class="admin-item__featured">{{ service.featured ? 'Destacado' : 'Normal' }}</span>
                  </div>
                  <strong>{{ service.name }}</strong>
                  <p>{{ service.category }} - {{ service.mode }}</p>
                  <small>{{ service.description }}</small>
                </article>
              </div>

              <ng-template #emptyCreated>
                <div class="empty-state">Aun no hay servicios creados en localStorage.</div>
              </ng-template>
            </div>
          </section>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .contact-list {
      display: grid;
      gap: 1rem;
      margin-top: 1rem;
    }
  `]
})
export class AdminComponent {
  /** Servicios creados por el usuario y almacenados en localStorage. */
  @Input() customServices: CatalogService[] = [];

  /** Evento que envia al componente padre el nuevo servicio validado. */
  @Output() createService = new EventEmitter<ServiceForm>();
  @Output() clearServices = new EventEmitter<void>();

  saved = false;
  form: ServiceForm = this.createEmptyForm();

  /**
   * Valida el formulario template-driven antes de emitir el servicio.
   */
  submitForm(isValid: boolean): void {
    if (!isValid) {
      this.saved = false;
      return;
    }

    this.createService.emit({ ...this.form });
    this.saved = true;
    this.form = this.createEmptyForm();
  }

  resetForm(): void {
    this.saved = false;
    this.form = this.createEmptyForm();
  }

  private createEmptyForm(): ServiceForm {
    return {
      name: '',
      description: '',
      category: '',
      mode: '',
      price: '',
      badge: '',
      featured: false
    };
  }
}
