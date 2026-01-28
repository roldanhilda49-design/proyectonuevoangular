import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Productomodels } from '../../../models/productomodels';
import { Categoriamodels } from '../../../models/categoriamodels';
import { ProductoService } from '../../../services/producto';
import { Categoria } from '../../../services/categoria';
import { CarritoService } from '../../../core/services/carrito';

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
  productoEditando: string | null = null;
  prodAux: any = {};

  constructor(
    private productoService: ProductoService,
    private categoriaService: Categoria,
    private carritoService: CarritoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.categoriaService.ObtenerCategorias().subscribe(cat => {
      this.categorias = cat;
      this.cargarProductos();
    });
  }

  // ESTA ES LA FUNCIÓN QUE TE PEDÍA EL ERROR TS2339
  agregarAlCarrito(p: Productomodels) {
    if (p.stock > 0) {
      this.carritoService.agregar(p);
      alert(`Añadido al carrito: ${p.nombre}`);
    } else {
      alert('Este producto no tiene stock disponible.');
    }
  }

  cargarProductos() {
    this.productoService.obtenerProductos().subscribe({
      next: (prod) => {
        // Limpiamos la lista de nulos
        this.productos = prod.filter(p => p && p.nombre && p.nombre.trim() !== '');
        this.filtrarProductos(); 
        this.cdr.detectChanges(); // Vital para refrescar el panel
      },
      error: (err) => console.error("Error al cargar productos:", err)
    });
  }

  filtrarProductos() {
    const busqueda = this.terminoBusqueda.toLowerCase().trim();
    this.productosFiltrados = this.productos.filter(p => 
      p.nombre.toLowerCase().includes(busqueda)
    );
    this.cdr.detectChanges();
  }

  getNombreCategoria(id: string): string {
    const cat = this.categorias.find(c => c.id === id);
    return cat ? cat.nombre : 'Sin Categoría';
  }

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

  iniciarEdicion(p: Productomodels) {
    this.productoEditando = p.id!;
    this.prodAux = { ...p };
  }

  async guardarCambios() {
    if (!this.productoEditando) return;
    try {
      await this.productoService.actualizarProducto(this.productoEditando, this.prodAux);
      this.productoEditando = null;
      alert("Cambios guardados con éxito.");
    } catch (error) { 
      console.error("Error al guardar:", error); 
    }
  }

  cancelarEdicion() { 
    this.productoEditando = null; 
  }

  async eliminar(id: string) {
    if (confirm("¿Seguro que deseas eliminar este producto?")) {
      try {
        await this.productoService.eliminarProducto(id);
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  }
}