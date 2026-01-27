import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Usuarioo } from '../../../../models/usuario.model';
import { Usuario } from '../../../../services/usuario';

@Component({
  selector: 'app-cambiar-rol',
  standalone: false,
  templateUrl: './cambiar-rol.html',
  styleUrl: './cambiar-rol.css',
})
export class CambiarRol implements OnInit{
  usuarios: Usuarioo[] = [];
  rolSeleccionado: {[uid: string]: string} = {};
  constructor(private usuario: Usuario,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.usuario.ObtenerUsuarios().subscribe((usuarios: Usuarioo[]) => {
      console.log(usuarios);
      
      this.usuarios = usuarios;
      this.cdr.detectChanges();
      usuarios.forEach((usuario) => {
        this.rolSeleccionado[usuario.uid] = usuario.rol;
      });
    });
  }
  cambiarRol(uid: string): void {
    const rolNuevo = this.rolSeleccionado[uid];
    this.usuario.cambiarRol(uid, rolNuevo).then(() => {
      console.log('rol cambiado exitosamente');
      
    })
  }
}
