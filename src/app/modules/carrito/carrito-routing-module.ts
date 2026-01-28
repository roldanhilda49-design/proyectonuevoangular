import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarritoListaComponent } from './pages/carrito-lista/carrito-lista';
const routes: Routes = [
  {
    path: '', // Ruta vacía porque ya viene definida desde el app-routing como /carrito
    component: CarritoListaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarritoRoutingModule { }