import { Component, OnInit, OnDestroy, Injector, runInInjectionContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-asistencia',
  standalone: false,
  templateUrl: './asistencia.html',
  styleUrl: './asistencia.css'
})
export class AsistenciaComponent implements OnInit, OnDestroy {
  // RELOJ INDEPENDIENTE
  reloj$: Observable<string>; 
  fechaEspanol: string = ''; // Cambiado de fechaEspañol a fechaEspanol

  // ESTADOS DE REGISTRO
  entradaHecha = false;
  salidaHecha = false;
  
  // VARIABLES FIJAS PARA LAS FOTOS
  infoEntrada: string | null = null;
  infoSalida: string | null = null;
  
  mensajeFeedback: string = '';
  documentoId: string | null = null;

  constructor(
    private firestore: AngularFirestore,
    private injector: Injector 
  ) {
    // Reloj en tiempo real
    this.reloj$ = interval(1000).pipe(
      map(() => new Date().toLocaleTimeString('es-ES'))
    );

    // Configuración de fecha en español
    const opciones: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    this.fechaEspanol = new Date().toLocaleDateString('es-ES', opciones);
  }

  ngOnInit() {
    setTimeout(() => this.verificarDatos(), 500);
  }

  ngOnDestroy() {} 

  registrarEntrada() {
    runInInjectionContext(this.injector, () => {
      const storageUser = localStorage.getItem('user');
      const userData = storageUser ? JSON.parse(storageUser) : null;
      const email = userData?.email || "Empleada1@gmail.com";
      
      const ahora = new Date();
      const horaFoto = ahora.toLocaleTimeString('es-ES');

      this.firestore.collection('asistencias').add({
        email: email,
        fecha: ahora.toLocaleDateString('es-ES'),
        horaEntrada: horaFoto,
        horaSalida: null,
        timestamp: Date.now()
      }).then((doc) => {
        this.documentoId = doc.id;
        this.entradaHecha = true;
        this.infoEntrada = horaFoto;
        this.mensajeFeedback = '¡Entrada registrada con éxito! ✅';
        setTimeout(() => this.mensajeFeedback = '', 3000);
      });
    });
  }

  registrarSalida() {
    runInInjectionContext(this.injector, () => {
      const horaFoto = new Date().toLocaleTimeString('es-ES');

      if (this.documentoId) {
        this.firestore.collection('asistencias').doc(this.documentoId).update({
          horaSalida: horaFoto
        }).then(() => {
          this.salidaHecha = true;
          this.infoSalida = horaFoto; 
          this.mensajeFeedback = '¡Salida registrada con éxito! 👋';
          setTimeout(() => this.mensajeFeedback = '', 3000);
        });
      }
    });
  }

  verificarDatos() {
    runInInjectionContext(this.injector, () => {
      const storageUser = localStorage.getItem('user');
      const userData = storageUser ? JSON.parse(storageUser) : null;
      const email = userData?.email || "Empleada1@gmail.com";

      this.firestore.collection('asistencias', ref => 
        ref.where('email', '==', email).orderBy('timestamp', 'desc').limit(1)
      ).valueChanges({ idField: 'id' }).subscribe((res: any[]) => {
        if (res.length > 0) {
          const hoy = new Date().toLocaleDateString('es-ES');
          const ultimo = res[0];
          if (ultimo.fecha === hoy) {
            this.documentoId = ultimo.id;
            this.entradaHecha = true;
            this.infoEntrada = ultimo.horaEntrada;
            if (ultimo.horaSalida) {
              this.salidaHecha = true;
              this.infoSalida = ultimo.horaSalida;
            }
          }
        }
      });
    });
  }
}