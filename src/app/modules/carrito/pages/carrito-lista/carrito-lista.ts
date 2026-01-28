import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CarritoService } from '../../../../core/services/carrito';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrito-lista',
  standalone: false,
  templateUrl: './carrito-lista.html',
  styleUrls: ['./carrito-lista.css']
})
export class CarritoListaComponent implements OnInit {
  items: any[] = [];
  total: number = 0;

  private carritoService = inject(CarritoService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  ngOnInit() {
    this.carritoService.carrito$.subscribe(res => {
      this.items = res;
      this.total = this.items.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
      this.cdr.detectChanges();
    });
  }

  async confirmarPedido() {
    if (this.items.length === 0) return;

    // 1. Mostrar carga pro
    Swal.fire({
      title: 'Procesando pedido...',
      text: 'Por favor, espera un momento.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const exito = await this.carritoService.finalizarCompra(this.total);
    
    // 2. Cerrar carga
    Swal.close();

    if (exito) {
      // 3. Notificación de éxito
      await Swal.fire({
        icon: 'success',
        title: '¡Venta realizada! ✅',
        text: 'Tu pedido se guardó correctamente.',
        confirmButtonColor: '#28a745',
        confirmButtonText: 'Volver al Catálogo'
      });

      // 4. NAVEGACIÓN CORREGIDA:
      // Usamos '/cliente/catalogo' porque '/cliente/bienvenida' NO está en tu AppRoutingModule
      this.router.navigate(['/cliente/catalogo']); 
      
    } else {
      // 5. Notificación de error
      Swal.fire({
        icon: 'error',
        title: 'Error de Red',
        text: 'No pudimos conectar con la base de datos.',
        confirmButtonColor: '#d33'
      });
    }
  }

  vaciar() {
    this.carritoService.limpiarCarrito();
  }

  eliminarItem(id: string) {
    this.carritoService.eliminar(id);
  }
}