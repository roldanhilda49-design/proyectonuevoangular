import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BienvenidaAdmin } from './bienvenida-admin/bienvenida-admin';
import { BienvenidaUsuario } from './bienvenida-usuario/bienvenida-usuario';
import { CambiarRol } from './bienvenida-admin/cambiar-rol/cambiar-rol';
import { DesactivarUsuario } from './bienvenida-admin/desactivar-usuario/desactivar-usuario';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GestionarCategoria } from './gestionar-categoria/gestionar-categoria';
import { GestionarProducto } from './gestionar-producto/gestionar-producto';
import { ListarProductos } from './listar-productos/listar-productos';
import { AsistenciaComponent } from './asistencia/asistencia';

@NgModule({
  declarations: [
    BienvenidaAdmin,
    BienvenidaUsuario,
    CambiarRol,
    DesactivarUsuario,
    GestionarCategoria,
    GestionarProducto,
    ListarProductos,
    AsistenciaComponent 
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ]
})
export class DashboardModule { }
