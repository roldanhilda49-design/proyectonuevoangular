import { Component, OnInit, Injector, runInInjectionContext, ChangeDetectorRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-historial',
  standalone: false,
  templateUrl: './historial.html',
  styleUrl: './historial.css'
})
export class HistorialComponent implements OnInit {
  historial: any[] = [];
  cargando: boolean = true;

  constructor(
    private firestore: AngularFirestore,
    private injector: Injector,
    private cdr: ChangeDetectorRef // <-- Esto es la clave
  ) {}

  ngOnInit() {
    this.obtenerHistorial();
  }

  obtenerHistorial() {
    runInInjectionContext(this.injector, () => {
      const storageUser = localStorage.getItem('user');
      const userData = storageUser ? JSON.parse(storageUser) : null;
      const email = userData?.email || "Empleada1@gmail.com";

      this.firestore.collection('asistencias', ref => 
        ref.where('email', '==', email).orderBy('timestamp', 'desc')
      ).valueChanges().subscribe({
        next: (data: any[]) => {
          this.historial = data;
          this.cargando = false;
          
          // FORZAMOS A ANGULAR A MOSTRAR LOS DATOS AHORA MISMO
          this.cdr.detectChanges(); 
          console.log("Datos cargados y pantalla actualizada");
        },
        error: (err) => {
          this.cargando = false;
          this.cdr.detectChanges();
          console.error("Error:", err);
        }
      });
    });
  }
}