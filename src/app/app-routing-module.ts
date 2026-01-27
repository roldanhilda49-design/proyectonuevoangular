import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrarComponent } from './modules/auth/registrar/registrar';
import { LoginComponent } from './modules/auth/login/login';
import { BienvenidaAdmin } from './modules/dashboard/bienvenida-admin/bienvenida-admin';
import { BienvenidaUsuario } from './modules/dashboard/bienvenida-usuario/bienvenida-usuario';
import { CambiarRol } from './modules/dashboard/bienvenida-admin/cambiar-rol/cambiar-rol';
import { DesactivarUsuario } from './modules/dashboard/bienvenida-admin/desactivar-usuario/desactivar-usuario';
import { GestionarCategoria } from './modules/dashboard/gestionar-categoria/gestionar-categoria'
import { GestionarProducto } from './modules/dashboard/gestionar-producto/gestionar-producto';
import { ListarProductos } from './modules/dashboard/listar-productos/listar-productos';
import {  AsistenciaComponent } from './modules/dashboard/asistencia/asistencia';
import { HistorialComponent } from './modules/dashboard/asistencia/historial/historial';
const routes: Routes = [
   { path: '', redirectTo: 'login', pathMatch: 'full'},
   {path: 'registrar', component: RegistrarComponent},
   {path: 'login', component: LoginComponent },
   {path: 'admin', component: BienvenidaAdmin,children:[
    {path:'cambiar-rol', component:CambiarRol},
    {path:'desactivar-usuario', component: DesactivarUsuario},
    {path:'gestionar-categoria', component: GestionarCategoria},
    {path: 'gestionar-producto', component: GestionarProducto},
    {path: 'listar-productos', component: ListarProductos}
   ]},
   {
  path: 'usuario', 
  component: BienvenidaUsuario,
  children: [
    { path: 'marcar-asistencia', component:  AsistenciaComponent },
    { path: 'listar-productos', component: ListarProductos }, // También le damos acceso a ver productos
    { path: 'mi-historial', component: HistorialComponent }
  ]
},
   {path: 'cambiar-role', component: CambiarRol},
   {path: 'desactivarusuario', component: DesactivarUsuario}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }