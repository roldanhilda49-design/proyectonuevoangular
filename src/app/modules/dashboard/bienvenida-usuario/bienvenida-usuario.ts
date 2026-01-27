import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-bienvenida-usuario',
  standalone: false,
  templateUrl: './bienvenida-usuario.html',
  styleUrl: './bienvenida-usuario.css',
})
export class BienvenidaUsuario {
  
  constructor(private authService: AuthService, private router: Router) {}

  cerrarSesion() {
    this.authService.logout().then(() => {
      // 1. Limpieza profunda de almacenamiento
      localStorage.clear();
      sessionStorage.clear();

      console.log('Sesión de empleado cerrada');

      // 2. ROMPER EL BUCLE: En lugar de solo navegar, redirigimos físicamente
      // Esto reinicia el estado de Angular y evita que los Guards se confundan
      window.location.href = '/login'; 
      
    }).catch(error => {
      console.log('Error al salir:', error);
      // Si falla Firebase, igual forzamos la salida local
      localStorage.clear();
      window.location.href = '/login';
    });
  }
}