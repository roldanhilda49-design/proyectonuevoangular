import { Component, Injector, runInInjectionContext } from '@angular/core'; // Añadimos estas importaciones
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar',
  standalone: false,
  templateUrl: './registrar.html',
  styleUrl: './registrar.css',
})
export class RegistrarComponent {
  nombre: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private injector: Injector // Inyectamos el inyector de Angular
  ) {}

  async registrar() {
    // 1. Validación de los 3 campos
    if (!this.nombre || !this.email || !this.password) {
      Swal.fire('Error', 'Por favor, completa todos los campos (Nombre, Correo y Contraseña)', 'error');
      return;
    }

    Swal.fire({
      title: 'Creando cuenta...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      // 2. Crear en Auth
      const res = await this.authService.registrar(this.email, this.password);
      const uid = res.user?.uid;

      if (uid) {
        const datosUsuario = {
          uid: uid,
          email: this.email.toLowerCase().trim(),
          nombre: this.nombre,
          rol: 'cliente'
        };

        // 3. EJECUCIÓN DENTRO DEL CONTEXTO (Solución al error NG0203)
        // Usamos runInInjectionContext para que Angular no pierda el hilo de Firebase
        await runInInjectionContext(this.injector, async () => {
          await this.authService.GuardarUsuario(datosUsuario);
        });

        Swal.close();
        await Swal.fire('¡Éxito!', 'Usuario registrado correctamente como cliente', 'success');
        
        // 4. Redirigir al catálogo
        this.router.navigate(['/cliente/catalogo']);
      }
    } catch (error: any) {
      Swal.close();
      console.error('Error en registro:', error);
      let msg = 'No se pudo registrar.';
      if (error.code === 'auth/email-already-in-use') msg = 'El correo ya existe.';
      Swal.fire('Error', msg, 'error');
    }
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}