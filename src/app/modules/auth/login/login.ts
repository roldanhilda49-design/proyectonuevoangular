import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService
      .login(this.email, this.password)
      .then((cred) => {
        const uid = cred.user?.uid || '';
        
        this.authService.ObtenerUsuario(uid).subscribe((usuario: any) => {
          // GUARDAR SESIÓN PARA QUE ASISTENCIA E HISTORIAL SEPAN QUIÉN ES
          const datosSesion = {
            uid: uid,
            email: this.email.toLowerCase().trim(), // Normalizamos el email
            rol: usuario.rol,
            nombre: usuario.nombre || ''
          };
          
          localStorage.setItem('user', JSON.stringify(datosSesion));

          if (usuario.rol === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/usuario/marcar-asistencia']);
          }
        });
      })
      .catch((error) => {
        console.error("Error en login:", error);
        alert("Credenciales incorrectas");
      });
  }

  irARegistro() {
    this.router.navigate(['/registrar']);
  }
}