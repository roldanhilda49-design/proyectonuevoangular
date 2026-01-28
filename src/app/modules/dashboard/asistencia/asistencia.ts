import { Component, OnInit, OnDestroy, ChangeDetectorRef, Injector, runInInjectionContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { interval, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-asistencia',
  standalone: false,
  templateUrl: './asistencia.html',
  styleUrl: './asistencia.css'
})
export class AsistenciaComponent implements OnInit, OnDestroy {
  reloj$: Observable<string>; 
  fechaEspanol: string = ''; 
  
  // Variables de estado dinámico
  entradaHecha = false; // Controla si el botón de ENTRADA está activo
  salidaHecha = false;  // Controla si el botón de SALIDA está activo
  
  infoEntrada: string | null = null;
  infoSalida: string | null = null;
  mensajeFeedback: string = ''; 
  documentoId: string | null = null;
  private sub?: Subscription;

  constructor(
    private firestore: AngularFirestore, 
    private cdr: ChangeDetectorRef,
    private injector: Injector
  ) {
    this.reloj$ = interval(1000).pipe(map(() => new Date().toLocaleTimeString('es-ES')));
    const opciones: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    this.fechaEspanol = new Date().toLocaleDateString('es-ES', opciones);
  }

  ngOnInit() {
    runInInjectionContext(this.injector, () => {
      this.verificarEstadoActual();
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  } 

  // Esta función decide qué botón habilitar basándose en el ÚLTIMO registro
  verificarEstadoActual() {
    const data = localStorage.getItem('user');
    if (!data) return;

    const email = JSON.parse(data).email;

    this.sub = this.firestore.collection('asistencias', ref => 
      ref.where('email', '==', email).orderBy('timestamp', 'desc').limit(1)
    ).valueChanges({ idField: 'id' }).subscribe((res: any[]) => {
      
      if (res.length > 0) {
        const ultimoRegistro = res[0];
        
        // REGLA: Si el último registro NO tiene hora de salida, significa que está "adentro"
        if (!ultimoRegistro.horaSalida) {
          this.documentoId = ultimoRegistro.id;
          this.entradaHecha = true;  // Bloqueamos entrada
          this.salidaHecha = false;  // Habilitamos salida
          this.infoEntrada = ultimoRegistro.horaEntrada;
          this.infoSalida = null;
        } else {
          // Si el último registro SÍ tiene salida, puede volver a entrar
          this.entradaHecha = false; // Habilitamos entrada
          this.salidaHecha = true;  // Bloqueamos salida
          this.infoEntrada = null;
          this.infoSalida = ultimoRegistro.horaSalida;
          this.documentoId = null;
        }
      } else {
        // Primer registro de la historia
        this.entradaHecha = false;
        this.salidaHecha = true;
      }
      this.cdr.detectChanges();
    });
  }

  registrarEntrada() {
    runInInjectionContext(this.injector, () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const ahora = new Date();

      this.firestore.collection('asistencias').add({
        email: user.email,
        fecha: ahora.toLocaleDateString('es-ES'),
        horaEntrada: ahora.toLocaleTimeString('es-ES'),
        horaSalida: null, // Se queda nulo hasta que marque salida
        timestamp: Date.now()
      }).then(() => {
        this.mensajeFeedback = '¡Entrada registrada! ✅';
        this.cdr.detectChanges();
        setTimeout(() => { this.mensajeFeedback = ''; this.cdr.detectChanges(); }, 3000);
      });
    });
  }

  registrarSalida() {
    if (!this.documentoId) return;

    runInInjectionContext(this.injector, () => {
      this.firestore.collection('asistencias').doc(this.documentoId!).update({
        horaSalida: new Date().toLocaleTimeString('es-ES'),
        timestamp: Date.now() // Actualizamos el timestamp para que sea el registro más reciente
      }).then(() => {
        this.mensajeFeedback = '¡Salida registrada! 👋';
        this.cdr.detectChanges();
        setTimeout(() => { this.mensajeFeedback = ''; this.cdr.detectChanges(); }, 3000);
      });
    });
  }
}