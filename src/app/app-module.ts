import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Firebase Compat Modules
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

// Configuración y Rutas
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

// Módulos de Funcionalidad
import { AuthModule } from './modules/auth/auth-module';
import { DashboardModule } from './modules/dashboard/dashboard-module';
import { CarritoModule } from './modules/carrito/carrito-module';

// Servicios
import { ProductoService } from './services/producto';
import { CarritoService } from './core/services/carrito';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    // Inicialización de Firebase
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule, 
    
    // Módulos de la aplicación
    AuthModule,
    DashboardModule,
    CarritoModule,
    
    // Rutas
    AppRoutingModule
  ],
  providers: [
    ProductoService, // Forzamos proveedor aquí para evitar NG0203
    CarritoService
  ],
  bootstrap: [App]
})
export class AppModule { }