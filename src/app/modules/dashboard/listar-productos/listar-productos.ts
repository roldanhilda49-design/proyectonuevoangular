import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Productomodels } from '../../../models/productomodels';
import { Categoriamodels } from '../../../models/categoriamodels';
import { Categoria } from '../../../services/categoria';
import { ProductoService } from '../../../services/producto';

@Component({
  selector: 'app-listar-productos',
  standalone: false,
  templateUrl: './listar-productos.html',
  styleUrl: './listar-productos.css'
})
export class ListarProductos implements OnInit {
  productos: Productomodels[] = [];
  categorias: Categoriamodels[] = [];
  productosFiltrados: Productomodels[] = []; 
  terminoBusqueda: string = '';

  // PROPIEDADES PARA EDICIÓN
  productoEditando: string | null = null;
  prodAux: any = {}; // Objeto temporal para no modificar el original antes de guardar

  constructor(
    private productoService: ProductoService,
    private categoriaService: Categoria,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.categoriaService.ObtenerCategorias().subscribe(cat => {
      this.categorias = cat;
      this.cargarProductos();
    });
  }

  cargarProductos() {
    this.productoService.obtenerProductos().subscribe(prod => {
      // Filtramos nulos para evitar cuadros negros
      this.productos = prod.filter(p => p && p.nombre && p.nombre.trim() !== '');
      this.filtrarProductos(); 
      this.cdr.detectChanges();
    });
  }

  filtrarProductos() {
    const busqueda = this.terminoBusqueda.toLowerCase().trim();
    this.productosFiltrados = this.productos.filter(p => p.nombre.toLowerCase().includes(busqueda));
    this.cdr.detectChanges();
  }

  getNombreCategoria(id: string): string {
    const cat = this.categorias.find(c => c.id === id);
    return cat ? cat.nombre : 'Sin Categoría';
  }

  // ALARMA DE 48 HORAS
  getAlertaVencimiento(fecha: string) {
    if (!fecha) return { clase: 'v-ok', mensaje: 'SEGURO', icono: '✅' };
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    const fechaVenc = new Date(fecha);
    const dif = Math.floor((fechaVenc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

    if (dif < 0) return { clase: 'v-critico', mensaje: 'VENCIDO', icono: '🚫' };
    if (dif <= 2) return { clase: 'v-emergencia', mensaje: '48 HORAS', icono: '🔥' };
    return { clase: 'v-ok', mensaje: 'SEGURO', icono: '✅' };
  }

  // MÉTODOS DE ACCIÓN (NUEVOS)
  iniciarEdicion(p: Productomodels) {
    this.productoEditando = p.id!;
    this.prodAux = { ...p }; // Clonamos el producto para editar
  }

  async guardarCambios() {
    if (!this.productoEditando) return;
    try {
      await this.productoService.actualizarProducto(this.productoEditando, this.prodAux);
      this.productoEditando = null;
      alert('Producto actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  }

  cancelarEdicion() {
    this.productoEditando = null;
  }

  async eliminar(id: string) {
    if (confirm("¿Seguro que deseas eliminar este producto?")) {
      await this.productoService.eliminarProducto(id);
    }
  }
}