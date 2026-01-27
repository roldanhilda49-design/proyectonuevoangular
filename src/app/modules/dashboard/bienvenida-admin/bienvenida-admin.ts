import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bienvenida-admin',
  standalone: false,
  templateUrl: './bienvenida-admin.html',
  styleUrls: ['./bienvenida-admin.css'],
})
export class BienvenidaAdmin {
  constructor(private AuthService: AuthService, private router: Router) {}

  cerrarSesion() {
    // 1. Llamamos al servicio para cerrar la sesión en Firebase/Servidor
    this.AuthService.logout().then(() => {
      
      // 2. LIMPIEZA PROFUNDA: Borramos los datos que vimos en tu consola
      localStorage.removeItem('user'); // Borra específicamente el usuario
      localStorage.clear();           // Borra todo lo demás por seguridad
      sessionStorage.clear();         // Limpia la sesión del navegador

      // 3. REDIRECCIÓN CON BLOQUEO
      // replaceUrl: true hace que el botón "atrás" del navegador no funcione
      this.router.navigate(['/login'], { replaceUrl: true });
      
      console.log('Sesión cerrada y datos eliminados');
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }
}