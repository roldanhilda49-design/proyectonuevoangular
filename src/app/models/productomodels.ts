export interface Productomodels {
  id?: string;
  nombre: string;
  precio: number;
  stock: number;
  idCategoria: string;
  imagenUrl?: string;
  fechaVencimiento: string; 
  activo: boolean; // Necesario para evitar errores de compilación
}