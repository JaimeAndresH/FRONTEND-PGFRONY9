import { Injectable, signal } from '@angular/core';
import { ContactForm, ContactMessage } from './service.model';
import { STORAGE_KEYS } from './storage-keys';

@Injectable({ providedIn: 'root' })
export class ContactDataService {
  readonly contacts = signal<ContactMessage[]>(this.getContacts());

  /**
   * Guarda un mensaje de contacto con id y fecha generados automaticamente.
   */
  addContact(contact: ContactForm): void {
    const newContact: ContactMessage = {
      ...contact,
      id: `contact-${Date.now()}`,
      createdAt: new Date().toLocaleString('es-CO')
    };

    this.saveContacts([newContact, ...this.contacts()]);
  }

  clearContacts(): void {
    this.saveContacts([]);
  }

  private getContacts(): ContactMessage[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.contacts) ?? '[]') as ContactMessage[];
    } catch {
      return [];
    }
  }

  private saveContacts(contacts: ContactMessage[]): void {
    localStorage.setItem(STORAGE_KEYS.contacts, JSON.stringify(contacts));
    this.contacts.set(contacts);
  }
}
