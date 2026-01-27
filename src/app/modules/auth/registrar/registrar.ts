import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  standalone: false,
  templateUrl: './registrar.html',
  styleUrl: './registrar.css',
})
export class RegistrarComponent {
  email: string = '';
  password: string = '';
  constructor(private authService: AuthService,
              private router:Router
  ) {}
  registrar() {
    this.authService
      .registrar(this.email, this.password)
      .then(() => {
        console.log('Registro exitoso');
        this.router.navigate(['/usuario'] );

      })
      .catch((error) => {
        console.error('Error en registro:', error);
      });
  }
}
