import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Productomodels } from '../../../models/productomodels';
import { Categoriamodels } from '../../../models/categoriamodels';
import { Categoria } from '../../../services/categoria';
import { ProductoService } from '../../../services/producto';

@Component({
  selector: 'app-gestionar-producto',
  standalone: false,
  templateUrl: './gestionar-producto.html',
  styleUrl: './gestionar-producto.css'
})
export class GestionarProducto implements OnInit {
  categorias: Categoriamodels[] = [];
  nuevoProducto: Productomodels = {
    nombre: '',
    precio: 0,
    stock: 0,
    idCategoria: '',
    imagenUrl: '',
    fechaVencimiento: '', // Se inicializa vacío
    activo: true
  };
  
  imagenPreview: string | null = null;
  mensajeExito: boolean = false;

  constructor(
    private productoService: ProductoService,
    private categoriaService: Categoria,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.categoriaService.ObtenerCategorias().subscribe(cat => {
      this.categorias = cat;
      this.cdr.detectChanges();
    });
  }

  guardarProducto() {
    if(!this.nuevoProducto.nombre || !this.nuevoProducto.idCategoria || !this.nuevoProducto.fechaVencimiento) {
      alert("Por favor rellene todos los campos, incluyendo la fecha de vencimiento");
      return;
    }

    this.productoService.agregarProducto(this.nuevoProducto).then(() => {
      this.mensajeExito = true;
      // Limpiamos el formulario
      this.nuevoProducto = {
        nombre: '',
        precio: 0,
        stock: 0,
        idCategoria: '',
        imagenUrl: '',
        fechaVencimiento: '',
        activo: true
      };
      this.imagenPreview = null;
      setTimeout(() => this.mensajeExito = false, 3000);
      this.cdr.detectChanges();
    });
  }

  archivoSelecionado(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreview = e.target.result;
        this.nuevoProducto.imagenUrl = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }
}