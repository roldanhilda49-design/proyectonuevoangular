import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Categoriamodels } from '../../../models/categoriamodels';
import { Categoria } from '../../../services/categoria';

@Component({
  selector: 'app-gestionar-categoria',
  standalone: false,
  templateUrl: './gestionar-categoria.html',
  styleUrl: './gestionar-categoria.css',
})
export class GestionarCategoria implements OnInit {
  categorias: Categoriamodels[] = [];
  nuevaCategoria: Categoriamodels = {
    nombre: '',
    descripcion: '',
    activo: true,
    creadoEn: new Date(),
  };

  categoriaEditando: string | null = null;
  nombreEditado: string = '';
  descripcionEditada: string = '';

  constructor(
    private categoriaService: Categoria,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.categoriaService.ObtenerCategorias().subscribe((categorias: Categoriamodels[]) => {
      this.categorias = categorias;
      this.cdr.detectChanges(); 
    });
  }

  guardarCategoria() {
    if(!this.nuevaCategoria.nombre) return;
    this.categoriaService.agregarCategoria(this.nuevaCategoria).then(() => {
      this.nuevaCategoria = { nombre: '', descripcion: '', activo: true, creadoEn: new Date() };
      this.cdr.detectChanges();
    });
  }

  editarCategoria(categoria: Categoriamodels) {
    this.categoriaEditando = categoria.id!;
    this.nombreEditado = categoria.nombre;
    this.descripcionEditada = categoria.descripcion;
    this.cdr.detectChanges();
  }

  guardarEdicion(categoria: Categoriamodels) {
    this.categoriaService.actualizarCategoria(categoria.id!, {
      nombre: this.nombreEditado,
      descripcion: this.descripcionEditada
    }).then(() => {
      this.cancelarEdicion();
    });
  }

  cancelarEdicion() {
    this.categoriaEditando = null;
    this.cdr.detectChanges();
  }



  alterarCategoria(categoria: Categoriamodels) {
  
    const nuevoEstado = !categoria.activo;
    this.categoriaService.actualizarCategoria(categoria.id!, { activo: nuevoEstado })
      .then(() => {
        console.log('Estado actualizado');
        this.cdr.detectChanges();
      });
  }

  eliminarCategoria(id: string) {
    const confirmar = confirm("¿ESTÁS SEGURO QUE QUIERES ELIMINAR ESTA CATEGORÍA?");
    if (confirmar) {
      this.categoriaService.eliminarCategoria(id).then(() => {
        console.log('Categoría eliminada');
        this.cdr.detectChanges();
      }).catch(err => console.error("Error al eliminar", err));
    }
  }
}