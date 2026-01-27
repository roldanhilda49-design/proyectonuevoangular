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

  // Variables para la edición
  productoEditando: string | null = null;
  nombreEditado: string = '';
  precioEditado: number = 0;
  stockEditado: number = 0;
  categoriaEditada: string = '';

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
      this.productos = prod;
      this.cdr.detectChanges();
    });
  }

  getNombreCategoria(id: string): string {
    const cat = this.categorias.find(c => c.id === id);
    return cat ? cat.nombre : 'Sin categoría';
  }

  // --- LÓGICA DE EDICIÓN ---

  editarProducto(p: Productomodels) {
    this.productoEditando = p.id!;
    this.nombreEditado = p.nombre;
    this.precioEditado = p.precio;
    this.stockEditado = p.stock;
    this.categoriaEditada = p.idCategoria;
    this.cdr.detectChanges();
  }

  cancelarEdicion() {
    this.productoEditando = null;
    this.cdr.detectChanges();
  }

  guardarEdicion(p: Productomodels) {
    const datosActualizados = {
      nombre: this.nombreEditado,
      precio: this.precioEditado,
      stock: this.stockEditado,
      idCategoria: this.categoriaEditada
    };

    // Usamos el método actualizar del servicio (puedes usar el mismo que el de categorías)
    this.productoService.actualizarProducto(p.id!, datosActualizados).then(() => {
      this.productoEditando = null;
      this.cdr.detectChanges();
    });
  }

  eliminar(id: string) {
    if(confirm("¿ESTÁ SEGURO QUE QUIERE ELIMINAR ESTE PRODUCTO?")) {
      this.productoService.eliminarProducto(id);
    }
  }
}