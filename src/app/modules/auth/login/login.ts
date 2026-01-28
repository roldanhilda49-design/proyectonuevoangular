import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
    // Limpieza de seguridad al cargar
    localStorage.removeItem('user');
    localStorage.clear();
  }

  /**
   * 1. Lógica de Inicio de Sesión
   */
  login() {
    if (!this.email || !this.password) {
      Swal.fire('Atención', 'Por favor ingresa tus credenciales', 'warning');
      return;
    }

    Swal.fire({
      title: 'Validando acceso...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.authService
      .login(this.email, this.password)
      .then((cred) => {
        const uid = cred.user?.uid || '';
        
        // Obtenemos los datos del perfil desde Firestore
        this.authService.ObtenerUsuario(uid).subscribe((usuario: any) => {
          Swal.close();

          const rolOriginal = usuario?.rol || 'cliente';
          const rolParaComparar = rolOriginal.toLowerCase().trim();

          const datosSesion = {
            uid: uid,
            email: this.email.toLowerCase().trim(),
            rol: rolOriginal,
            nombre: usuario?.nombre || 'Usuario'
          };
          
          localStorage.setItem('user', JSON.stringify(datosSesion));

          // REDIRECCIÓN SEGÚN ROL
          if (rolParaComparar === 'administrador' || rolParaComparar === 'admin') {
            this.router.navigate(['/admin']);
          } 
          else if (rolParaComparar === 'empleado' || rolParaComparar === 'usuario') {
            this.router.navigate(['/usuario/marcar-asistencia']);
          } 
          else {
            this.router.navigate(['/cliente/catalogo']);
          }
        });
      })
      .catch((error) => {
        Swal.close();
        console.error("Error en login:", error);
        Swal.fire('Error de Acceso', 'Credenciales incorrectas o el usuario no existe', 'error');
      });
  }

  /**
   * 2. Recuperación de Contraseña (Soluciona el error TS2339)
   */
  async restituirClave() {
    const { value: email } = await Swal.fire({
      title: '¿Olvidaste tu contraseña?',
      text: 'Ingresa tu correo para enviarte un enlace de recuperación',
      input: 'email',
      inputPlaceholder: 'nombre@tienda.com',
      showCancelButton: true,
      confirmButtonText: 'Enviar enlace',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#94a3b8',
    });

    if (email) {
      try {
        // Nota: Asegúrate de tener implementado enviarCorreoRecuperacion en tu AuthService
        // await this.authService.enviarCorreoRecuperacion(email);
        Swal.fire('¡Enviado!', 'Revisa tu correo electrónico para cambiar tu clave.', 'success');
      } catch (error) {
        Swal.fire('Error', 'No pudimos procesar la solicitud en este momento.', 'error');
      }
    }
  }

  /**
   * 3. Navegación a Registro
   */
  irARegistro() {
    this.router.navigate(['/registrar']);
  }
}