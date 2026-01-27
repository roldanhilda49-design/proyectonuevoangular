import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // RESUELVE NG8004 (date, uppercase) y NG8002 (ngClass)
import { FormsModule } from '@angular/forms';   // RESUELVE NG8002 (ngModel)
import { RouterModule } from '@angular/router'; // RESUELVE NG8001 (router-outlet)

// Importa todos tus componentes del dashboard
import { BienvenidaAdmin } from './bienvenida-admin/bienvenida-admin';
import { BienvenidaUsuario } from './bienvenida-usuario/bienvenida-usuario';
import { GestionarCategoria } from './gestionar-categoria/gestionar-categoria';
import { GestionarProducto } from './gestionar-producto/gestionar-producto';
import { ListarProductos } from './listar-productos/listar-productos';
import { AsistenciaComponent } from './asistencia/asistencia';
import { CambiarRol } from './bienvenida-admin/cambiar-rol/cambiar-rol';
import { DesactivarUsuario } from './bienvenida-admin/desactivar-usuario/desactivar-usuario';
import { Historial } from './asistencia/historial/historial';

@NgModule({
  declarations: [
    BienvenidaAdmin,
    BienvenidaUsuario,
    GestionarCategoria,
    GestionarProducto,
    ListarProductos,
    AsistenciaComponent,
    CambiarRol,
    DesactivarUsuario,
    Historial
  ],
  imports: [
    CommonModule, // Activa pipes y directivas comunes
    FormsModule,   // Activa enlace de datos bidireccional
    RouterModule   // Activa navegación y outlets
  ]
})
export class DashboardModule { }