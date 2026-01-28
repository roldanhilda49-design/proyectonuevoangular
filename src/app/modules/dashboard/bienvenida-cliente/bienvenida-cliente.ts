import { Component, OnInit, ChangeDetectorRef, inject, Injector, runInInjectionContext } from '@angular/core';
import { ProductoService } from '../../../services/producto';
import { CarritoService } from '../../../core/services/carrito';
import { Productomodels } from '../../../models/productomodels';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bienvenida-cliente',
  standalone: false,
  templateUrl: './bienvenida-cliente.html',
  styleUrl: './bienvenida-cliente.css'
})
export class BienvenidaCliente implements OnInit {
  productos: Productomodels[] = [];
  mostrarCarrito: boolean = false;
  mensajeAlerta: string | null = null; 
  
  public router = inject(Router);
  private productoService = inject(ProductoService);
  private carritoService = inject(CarritoService);
  private afAuth = inject(AngularFireAuth);
  private cdr = inject(ChangeDetectorRef);
  private injector = inject(Injector);

  constructor() {
    this.cargarCatalogo();
  }

  ngOnInit() {}

  cargarCatalogo() {
    runInInjectionContext(this.injector, () => {
      this.productoService.obtenerProductos().subscribe({
        next: (res) => {
          this.productos = res.filter(p => p.stock > 0);
          this.cdr.detectChanges();
        },
        error: (err) => console.error("Error cargando productos:", err)
      });
    });
  }

  toggleCarrito() {
    this.mostrarCarrito = !this.mostrarCarrito;
    if (this.mostrarCarrito) {
      this.router.navigate(['/cliente/mi-carrito']);
    } else {
      this.router.navigate(['/cliente/catalogo']);
    }
  }

  agregar(p: Productomodels) {
    if (!p.id) return;
    const enCarrito = this.carritoService.obtenerCantidadPorProducto(p.id);
    if (enCarrito < p.stock) {
      this.carritoService.agregar(p);
      if (!this.mostrarCarrito) this.toggleCarrito();
    } else {
      this.lanzarToast(`Límite alcanzado: Solo hay ${p.stock} unidades de ${p.nombre}`);
    }
  }

  lanzarToast(msj: string) {
    this.mensajeAlerta = msj;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.mensajeAlerta = null;
      this.cdr.detectChanges();
    }, 3500);
  }

  // --- FUNCIÓN DE CIERRE DE SESIÓN CORREGIDA ---
  async salir() {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: "Se borrarán los datos de tu sesión actual.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        // 1. Cerramos en Firebase
        await this.afAuth.signOut();
        
        // 2. Limpiamos LocalStorage (Esto evita el "rebote")
        localStorage.removeItem('user'); 
        localStorage.clear(); 

        // 3. Redirección total para limpiar la memoria de Angular
        window.location.href = '/login';
      } catch (error) {
        console.error("Error al salir:", error);
      }
    }
  } 
}