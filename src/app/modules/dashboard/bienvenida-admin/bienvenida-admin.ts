import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bienvenida-admin',
  standalone: false,
  templateUrl: './bienvenida-admin.html',
  styleUrls: ['./bienvenida-admin.css'],
})
export class BienvenidaAdmin {

  // Usamos inject para un estilo más moderno o el constructor, ambos funcionan bien
  constructor(private authService: AuthService, private router: Router) {}

  async cerrarSesion() {
    // Usamos SweetAlert2 para que combine con el resto de tu app profesional
    const result = await Swal.fire({
      title: '¿Cerrar sesión de Administrador?',
      text: "Se cerrará el panel de control y deberás volver a loguearte.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        // 1. Llamamos al servicio para cerrar sesión en Firebase
        await this.authService.logout();

        // 2. LIMPIEZA PROFUNDA: Borramos rastro de usuario y roles
        localStorage.removeItem('user'); 
        localStorage.clear(); 
        sessionStorage.clear();

        console.log('Sesión cerrada y caché limpio');

        // 3. REDIRECCIÓN TOTAL (Evita el error de rebote al resetear la memoria de la app)
        window.location.href = '/login';

      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        // Si falla el logout de Firebase, igual forzamos la salida
        localStorage.clear();
        window.location.href = '/login';
      }
    }
  }
}