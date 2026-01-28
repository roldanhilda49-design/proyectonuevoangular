import { Component, OnInit, ChangeDetectorRef, Injector, runInInjectionContext } from '@angular/core';
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
    private cdr: ChangeDetectorRef,
    private injector: Injector // Inyectamos el motor de dependencias
  ) {}

  ngOnInit() {
    // Forzamos el contexto de inyección para evitar el error NG0203
    runInInjectionContext(this.injector, () => {
      this.obtenerHistorial();
    });
  }

  obtenerHistorial() {
    const data = localStorage.getItem('user');
    if (!data) {
      this.cargando = false;
      this.cdr.detectChanges();
      return;
    }
    
    try {
      const user = JSON.parse(data);
      const email = user.email;

      // Consulta protegida
      this.firestore.collection('asistencias', ref => 
        ref.where('email', '==', email).orderBy('timestamp', 'desc')
      ).valueChanges().subscribe({
        next: (res: any[]) => {
          this.historial = res;
          this.cargando = false;
          this.cdr.detectChanges(); // Forzamos que la vista se actualice
        },
        error: (err) => {
          console.error("Error al cargar historial:", err);
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
    } catch (e) {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }
}