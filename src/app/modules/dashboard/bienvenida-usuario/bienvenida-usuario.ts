import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth'; // Verifica que la ruta a tu servicio sea esta
import { Router } from '@angular/router';

@Component({
  selector: 'app-bienvenida-usuario',
  standalone: false,
  templateUrl: './bienvenida-usuario.html',
  styleUrl: './bienvenida-usuario.css',
})
export class BienvenidaUsuario {
  
  // Inyectamos el servicio de autenticación y el router
  constructor(private authService: AuthService, private router: Router) {}

  // Esta es la función que el HTML estaba buscando
  cerrarSesion() {
    this.authService.logout().then(() => {
      // 1. Limpiamos el rastro del empleado
      localStorage.clear();
      sessionStorage.clear();

      // 2. Lo mandamos al login y bloqueamos el botón "atrás"
      this.router.navigate(['/login'], { replaceUrl: true });
      
      console.log('Sesión de empleado cerrada');
    }).catch(error => {
      console.log('Error al salir:', error);
    });
  }
}