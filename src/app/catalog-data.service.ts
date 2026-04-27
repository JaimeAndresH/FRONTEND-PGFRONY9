import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { CatalogService, ServiceForm } from './service.model';
import { STORAGE_KEYS } from './storage-keys';

@Injectable({ providedIn: 'root' })
export class CatalogDataService {
  /**
   * Datos de respaldo por si falla la lectura del JSON local.
   */
  private readonly fallbackServices: CatalogService[] = [
    {
      id: 'edu-digital',
      name: 'Educacion Digital',
      description: 'Cursos y talleres de formacion tecnologica para fortalecer habilidades digitales y aprendizaje practico.',
      category: 'Educativo',
      mode: 'Virtual',
      price: 'Desde $120.000',
      badge: 'Destacado',
      featured: true,
      image: 'assets/img/service-education.svg'
    },
    {
      id: 'colab-empresarial',
      name: 'Colaboracion Empresarial',
      description: 'Soluciones de trabajo en equipo para empresas modernas con asesoria, procesos y herramientas colaborativas.',
      category: 'Comercial',
      mode: 'Hibrido',
      price: 'Desde $180.000',
      badge: 'Popular',
      featured: true,
      image: 'assets/img/service-collaboration.svg'
    },
    {
      id: 'innovacion-tech',
      name: 'Innovacion Tecnologica',
      description: 'Consultoria en transformacion digital para mejorar operaciones, experiencia del usuario y eficiencia.',
      category: 'Tecnologico',
      mode: 'Presencial',
      price: 'Desde $250.000',
      badge: 'Destacado',
      featured: true,
      image: 'assets/img/service-innovation.svg'
    },
    {
      id: 'turismo-inteligente',
      name: 'Turismo Inteligente',
      description: 'Experiencias turisticas apoyadas en tecnologia, rutas personalizadas y acompanamiento digital.',
      category: 'Turistico',
      mode: 'Experiencial',
      price: 'Desde $210.000',
      badge: 'Nuevo',
      featured: false,
      image: 'assets/img/service-tourism.svg'
    }
  ];

  readonly services = signal<CatalogService[]>([]);
  readonly customServices = signal<CatalogService[]>(this.getCustomServices());

  constructor(private readonly http: HttpClient) {
    this.loadServices();
  }

  get featuredServices(): CatalogService[] {
    return this.services().filter((service) => service.featured).slice(0, 3);
  }

  /**
   * Crea un servicio local, lo guarda en localStorage y refresca el catalogo.
   */
  addService(service: ServiceForm): void {
    const newService: CatalogService = {
      ...service,
      id: `custom-${Date.now()}`,
      image: 'assets/img/service-custom.svg'
    };

    const customServices = [newService, ...this.customServices()];
    this.saveCustomServices(customServices);
  }

  clearCustomServices(): void {
    this.saveCustomServices([]);
  }

  /**
   * Carga servicios estaticos desde JSON y los mezcla con los servicios locales.
   */
  private loadServices(): void {
    this.http.get<CatalogService[]>('data/services.json').subscribe({
      next: (items) => this.services.set([...this.customServices(), ...items]),
      error: () => this.services.set([...this.customServices(), ...this.fallbackServices])
    });
  }

  private baseServices(): CatalogService[] {
    return this.services().filter((service) => !service.id.startsWith('custom-'));
  }

  private getCustomServices(): CatalogService[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.customServices) ?? '[]') as CatalogService[];
    } catch {
      return [];
    }
  }

  private saveCustomServices(customServices: CatalogService[]): void {
    localStorage.setItem(STORAGE_KEYS.customServices, JSON.stringify(customServices));
    this.customServices.set(customServices);
    this.services.set([...customServices, ...this.baseServices()]);
  }
}
