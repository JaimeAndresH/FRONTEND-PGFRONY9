/**
 * Servicio que se muestra en el catalogo.
 * Puede venir del JSON estatico o ser creado por el usuario en localStorage.
 */
export interface CatalogService {
  id: string;
  name: string;
  description: string;
  category: string;
  mode: string;
  price: string;
  badge: string;
  featured: boolean;
  image: string;
}

/**
 * Datos guardados desde el formulario de contacto.
 */
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  createdAt: string;
}

/**
 * Datos que se capturan antes de crear el id y la imagen por defecto.
 */
export type ServiceForm = Omit<CatalogService, 'id' | 'image'>;

/**
 * Datos que escribe el usuario antes de guardar el contacto.
 */
export type ContactForm = Omit<ContactMessage, 'id' | 'createdAt'>;

/**
 * Vistas disponibles en la navegacion principal.
 */
export type ViewName = 'inicio' | 'servicios' | 'favoritos' | 'contacto' | 'administrar';
