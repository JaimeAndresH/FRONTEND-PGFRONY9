/**
 * Claves usadas para persistir datos de la app en localStorage.
 * Mantenerlas en un solo archivo evita errores por textos repetidos.
 */
export const STORAGE_KEYS = {
  customServices: 'catalogoPlusAdminServices',
  favorites: 'catalogoPlusFavoritesAngular',
  contacts: 'catalogoPlusContactsAngular'
} as const;
