import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ContactDataService } from './contact-data.service';
import { CatalogService, ContactForm } from './service.model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  template: `
    <main class="inner-page">
      <section class="page-hero">
        <div class="container">
          <span class="section-heading__tag">Contacto</span>
          <h1>Solicita asesoria</h1>
          <p>Los mensajes enviados se guardan en localStorage y se listan en esta misma pagina.</p>
        </div>
      </section>

      <section class="section">
        <div class="container contact-layout">
          <form class="contact-form" #contactForm="ngForm" (ngSubmit)="submitForm(contactForm.valid ?? false)">
            <div class="form-group">
              <label for="contact-name">Nombre completo</label>
              <input id="contact-name" name="name" type="text" required minlength="3" [(ngModel)]="form.name">
            </div>

            <div class="form-group">
              <label for="contact-email">Correo electronico</label>
              <input id="contact-email" name="email" type="email" required email [(ngModel)]="form.email">
            </div>

            <div class="form-group">
              <label for="contact-service">Servicio de interes</label>
              <select id="contact-service" name="service" required [(ngModel)]="form.service">
                <option value="">Selecciona un servicio</option>
                <option *ngFor="let service of services" [value]="service.name">{{ service.name }}</option>
                <option value="Servicio personalizado">Servicio personalizado</option>
              </select>
            </div>

            <div class="form-group">
              <label for="contact-message">Mensaje</label>
              <textarea id="contact-message" name="message" rows="5" required minlength="10" [(ngModel)]="form.message"></textarea>
            </div>

            <div class="admin-form__actions">
              <button class="button button--primary" type="submit">Enviar mensaje</button>
              <button class="button button--secondary" type="button" (click)="resetForm()">Limpiar</button>
            </div>

            <p class="form-success" [hidden]="!saved">Contacto guardado correctamente en localStorage.</p>
          </form>

          <aside class="contact-card">
            <span class="section-heading__tag">Mensajes guardados</span>
            <h2>{{ contacts.contacts().length }} contacto{{ contacts.contacts().length === 1 ? '' : 's' }}</h2>
            <p>Estos registros quedan disponibles mientras el navegador conserve el almacenamiento local.</p>

            <div class="admin-list__actions">
              <button class="button button--secondary" type="button" [disabled]="!contacts.contacts().length" (click)="contacts.clearContacts()">Eliminar contactos</button>
            </div>

            <div class="contact-list" *ngIf="contacts.contacts().length; else emptyContacts">
              <article class="admin-item" *ngFor="let contact of contacts.contacts()">
                <div class="admin-item__top">
                  <span class="admin-item__badge">{{ contact.service }}</span>
                  <span class="admin-item__featured">{{ contact.createdAt }}</span>
                </div>
                <strong>{{ contact.name }}</strong>
                <p>{{ contact.email }}</p>
                <small>{{ contact.message }}</small>
              </article>
            </div>

            <ng-template #emptyContacts>
              <div class="empty-state">Aun no hay contactos guardados.</div>
            </ng-template>
          </aside>
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
export class ContactComponent {
  /** Catalogo usado para poblar el selector de servicios de interes. */
  @Input() services: CatalogService[] = [];

  saved = false;
  form = this.createEmptyForm();

  constructor(readonly contacts: ContactDataService) {}

  /**
   * Guarda el contacto cuando el formulario cumple las validaciones.
   */
  submitForm(isValid: boolean): void {
    if (!isValid) {
      this.saved = false;
      return;
    }

    this.contacts.addContact({ ...this.form });
    this.saved = true;
    this.form = this.createEmptyForm();
  }

  resetForm(): void {
    this.saved = false;
    this.form = this.createEmptyForm();
  }

  private createEmptyForm(): ContactForm {
    return {
      name: '',
      email: '',
      service: '',
      message: ''
    };
  }
}
