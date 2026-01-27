import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Usuarioo } from '../../../../models/usuario.model';
import { Usuario } from '../../../../services/usuario';

@Component({
  selector: 'app-desactivar-usuario',
  standalone: false,
  templateUrl: './desactivar-usuario.html',
  styleUrl: './desactivar-usuario.css',
})
export class DesactivarUsuario implements OnInit {
  usuarios: Usuarioo[] = [];

  constructor(
    private usuarioService: Usuario,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Reutilizamos tu método ObtenerUsuarios
    this.usuarioService.ObtenerUsuarios().subscribe((usuarios: Usuarioo[]) => {
      this.usuarios = usuarios;
      this.cdr.detectChanges();
    });
  }

  toggleEstatus(uid: string, estadoActual: boolean): void {
    // Invertimos el estado: si es true pasa a false y viceversa
    const nuevoEstado = !estadoActual;
    
    this.usuarioService.desactivarUsuario(uid, nuevoEstado).then(() => {
      console.log('Estado del usuario actualizado');
    });
  }
}