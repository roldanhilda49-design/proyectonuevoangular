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
  email: string ='';
  password: string = '';
  constructor(private authService: AuthService,
              private router:Router
  ) {}
 
  login() {
    debugger
    this.authService
    .login(this.email, this.password)
    .then((cred)=>{
      const uid = cred.user?.uid || '';
      this.authService.ObtenerUsuario(uid).subscribe((usuario:any)=>{
        console.log(usuario);
        if (usuario.rol==='admin') {
          this.router.navigate(['/admin'])
        }
        else{
          this.router.navigate(['/usuario'])
        }
      })


  }
  ) }
  irARegistro() {
  this.router.navigate(['/registrar']);
}

} 


