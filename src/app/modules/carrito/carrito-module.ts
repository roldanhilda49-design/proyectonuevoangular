import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoListaComponent } from './pages/carrito-lista/carrito-lista';

@NgModule({
  declarations: [
    CarritoListaComponent // Aquí ya no dará error NG6008
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CarritoListaComponent
  ]
})
export class CarritoModule { }