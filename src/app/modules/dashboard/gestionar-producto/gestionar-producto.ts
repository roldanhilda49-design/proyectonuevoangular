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
    activo: true,
    creadoEn: new Date()
  };
imagenFile: File | null = null;
  imagenPreview: string | null = null;
  mensajeExito: boolean = false;

  constructor(
    private categoriaService: Categoria,
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.categoriaService.ObtenerCategorias().subscribe(res => {
      this.categorias = res;
      this.cdr.detectChanges();
    });
  }
archivoSelecionado(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    this.imagenFile = file;

    // Preview
    const reader = new FileReader();
    reader.onload = () => (this.imagenPreview = reader.result as string);
    reader.readAsDataURL(file);
  }
async guardarProducto() {
    debugger;
    if (!this.imagenFile) {
      alert('Seleccione una imagen');
      return;
    }
    const categoriaSeleccionada = this.categorias.find(
      (c) => c.id === this.nuevoProducto.idCategoria
    );

    if (categoriaSeleccionada) {
      this.nuevoProducto.idCategoria = categoriaSeleccionada.nombre;
    }

    await this.productoService.agregarProductoConImagen(
      this.nuevoProducto,
      this.imagenFile
    );

    alert('Producto agregado');

    this.nuevoProducto = {
      nombre: '',
      activo: true,
      precio: 0,
      stock: 0,
      idCategoria: '',
      creadoEn: new Date(),
    };

    this.imagenFile = null;
    this.imagenPreview = null;
  }
/*   guardarProducto() {
    
    if (!this.nuevoProducto.nombre) return alert("Ingresa el nombre del producto");
    if (!this.nuevoProducto.idCategoria) return alert("Selecciona una categoría");
    
    this.productoService.agregarProducto(this.nuevoProducto).then(() => {
      
      this.mensajeExito = true;

     
      this.nuevoProducto = { 
        nombre: '', 
        precio: 0, 
        stock: 0, 
        idCategoria: '', 
        activo: true, 
        creadoEn: new Date() 
      };

    
      this.cdr.detectChanges();
      
      setTimeout(() => {
        this.mensajeExito = false;
        this.cdr.detectChanges();
      }, 3000);

    }).catch(error => {
      console.error("Error al guardar producto:", error);
      alert("Error al guardar en el servidor");
    });
  } */
}