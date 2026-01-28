import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Al cargar el login, borramos cualquier rastro de usuario previo
    // Esto es una capa de seguridad extra contra el rebote
    localStorage.removeItem('user');
  }

  login() {
    this.authService
      .login(this.email, this.password)
      .then((cred) => {
        const uid = cred.user?.uid || '';
        
        this.authService.ObtenerUsuario(uid).subscribe((usuario: any) => {
          const rolOriginal = usuario.rol || '';
          const rolParaComparar = rolOriginal.toLowerCase().trim();

          console.log("Rol recibido:", rolOriginal);

          const datosSesion = {
            uid: uid,
            email: this.email.toLowerCase().trim(),
            rol: rolOriginal,
            nombre: usuario.nombre || ''
          };
          
          localStorage.setItem('user', JSON.stringify(datosSesion));

          // REDIRECCIÓN SEGÚN ROL
          if (rolParaComparar === 'administrador' || rolParaComparar === 'admin') {
            this.router.navigate(['/admin']);
          } 
          else if (rolParaComparar === 'cliente final' || rolParaComparar === 'cliente') {
            this.router.navigate(['/cliente/catalogo']); 
          } 
          else {
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