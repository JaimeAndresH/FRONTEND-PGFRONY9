# Organizacion de la app Angular

Esta carpeta contiene la implementacion principal de CatalogoPlus en Angular.

## Archivos de modelo y soporte

- `service.model.ts`: define las interfaces y tipos compartidos de la app.
- `storage-keys.ts`: centraliza las claves usadas para guardar datos en `localStorage`.
- `catalog-data.service.ts`: carga servicios estaticos desde `data/services.json`, administra servicios creados localmente y expone el catalogo completo.
- `contact-data.service.ts`: guarda, lista y elimina mensajes de contacto en `localStorage`.

## Componentes

- `app.component.ts`: componente raiz. Controla la vista activa y coordina favoritos, servicios y contactos.
- `header.component.ts`: navegacion principal entre vistas.
- `home.component.ts`: pagina inicial con servicios destacados.
- `services-list.component.ts`: listado filtrable de servicios.
- `service-card.component.ts`: tarjeta reutilizable para mostrar y marcar servicios como favoritos.
- `favorites.component.ts`: pagina de favoritos guardados.
- `contact.component.ts`: formulario y listado de contactos guardados.
- `admin.component.ts`: formulario para crear servicios locales y listarlos.

## Persistencia local

La app usa `localStorage` para tres datos:

- Servicios creados por el usuario.
- Favoritos.
- Contactos enviados.

Las claves estan definidas en `storage-keys.ts` para evitar duplicacion.
