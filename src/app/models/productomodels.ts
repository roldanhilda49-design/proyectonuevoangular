export interface Productomodels {
  id?: string;
  nombre: string;
  precio: number;
  stock: number;
  idCategoria: string; // Relación con la categoría
  activo: boolean;
  creadoEn: Date;
  imagenUrl?: String;
}