import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importaciones de Auth
import { RegistrarComponent } from './modules/auth/registrar/registrar';
import { LoginComponent } from './modules/auth/login/login';

// Importaciones de Dashboard (Admin y Empleado)
import { BienvenidaAdmin } from './modules/dashboard/bienvenida-admin/bienvenida-admin';
import { BienvenidaUsuario } from './modules/dashboard/bienvenida-usuario/bienvenida-usuario';
import { CambiarRol } from './modules/dashboard/bienvenida-admin/cambiar-rol/cambiar-rol';
import { DesactivarUsuario } from './modules/dashboard/bienvenida-admin/desactivar-usuario/desactivar-usuario';
import { GestionarCategoria } from './modules/dashboard/gestionar-categoria/gestionar-categoria';
import { GestionarProducto } from './modules/dashboard/gestionar-producto/gestionar-producto';
import { ListarProductos } from './modules/dashboard/listar-productos/listar-productos';
import { AsistenciaComponent } from './modules/dashboard/asistencia/asistencia';
import { HistorialComponent } from './modules/dashboard/asistencia/historial/historial';

// Importación del nuevo componente Cliente
import { BienvenidaCliente } from './modules/dashboard/bienvenida-cliente/bienvenida-cliente';

// Importación del Carrito
import { CarritoListaComponent } from './modules/carrito/pages/carrito-lista/carrito-lista';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'registrar', component: RegistrarComponent },
  { path: 'login', component: LoginComponent },

  // INTERFAZ DE ADMINISTRADOR
  { 
    path: 'admin', 
    component: BienvenidaAdmin, 
    children: [
      { path: 'cambiar-rol', component: CambiarRol },
      { path: 'desactivar-usuario', component: DesactivarUsuario },
      { path: 'gestionar-categoria', component: GestionarCategoria },
      { path: 'gestionar-producto', component: GestionarProducto },
      { path: 'listar-productos', component: ListarProductos }
    ]
  },

  // INTERFAZ DE EMPLEADO (USUARIO)
  {
    path: 'usuario', 
    component: BienvenidaUsuario,
    children: [
      { path: 'marcar-asistencia', component: AsistenciaComponent },
      { path: 'listar-productos', component: ListarProductos }, 
      { path: 'mi-historial', component: HistorialComponent },
      { path: 'carrito', component: CarritoListaComponent } 
    ]
  },

  // INTERFAZ DE CLIENTE (Recién creada)
  {
    path: 'cliente',
    component: BienvenidaCliente,
    children: [
      { path: 'catalogo', component: ListarProductos },
      { path: 'mi-carrito', component: CarritoListaComponent }
    ]
  },

  // Rutas auxiliares
  { path: 'cambiar-role', component: CambiarRol },
  { path: 'desactivarusuario', component: DesactivarUsuario },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }