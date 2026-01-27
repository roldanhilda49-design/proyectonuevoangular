import { Component, OnInit, OnDestroy, Injector, runInInjectionContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-asistencia',
  standalone: false,
  templateUrl: './asistencia.html',
  styleUrl: './asistencia.css'
})
export class AsistenciaComponent implements OnInit, OnDestroy {
  horaActual: string = '';
  fechaActual = new Date();
  private timer: any;

  // Variables de control
  entradaRegistrada = false;
  salidaRegistrada = false;
  horaEntrada: string | null = null;
  horaSalida: string | null = null;
  mensaje: string = '';
  historial: any[] = [];

  constructor(
    private firestore: AngularFirestore,
    private injector: Injector // Añadimos el inyector para evitar el error NG0203
  ) {}

  ngOnInit() {
    // Reloj
    this.timer = setInterval(() => {
      this.horaActual = new Date().toLocaleTimeString();
    }, 1000);

    // Ejecutamos la verificación después de que el componente cargue
    setTimeout(() => {
      this.verificarEstadoHoy();
    }, 100);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  registrarEntrada() {
    // Usamos el contexto de inyección explícito para evitar el error
    runInInjectionContext(this.injector, () => {
      const storageUser = localStorage.getItem('user');
      const userData = storageUser ? JSON.parse(storageUser) : null;
      const emailFinal = userData?.email || "Empleada1@gmail.com";
      const hoy = new Date().toLocaleDateString();
      const hora = new Date().toLocaleTimeString();

      this.firestore.collection('asistencias').add({
        email: emailFinal,
        fecha: hoy,
        horaEntrada: hora,
        horaSalida: null,
        timestamp: Date.now()
      }).then(() => {
        this.mensaje = 'Entrada registrada con éxito ✅';
        this.entradaRegistrada = true;
        this.horaEntrada = hora;
      }).catch(err => {
        console.error(err);
        this.mensaje = 'Error al guardar entrada ❌';
      });
    });
  }

  registrarSalida() {
    runInInjectionContext(this.injector, () => {
      const storageUser = localStorage.getItem('user');
      const userData = storageUser ? JSON.parse(storageUser) : null;
      const emailFinal = userData?.email || "Empleada1@gmail.com";
      const hoy = new Date().toLocaleDateString();

      this.firestore.collection('asistencias', ref => 
        ref.where('email', '==', emailFinal).where('fecha', '==', hoy)
      ).get().subscribe(snapshot => {
        if (!snapshot.empty) {
          const docId = snapshot.docs[0].id;
          const horaS = new Date().toLocaleTimeString();
          this.firestore.collection('asistencias').doc(docId).update({
            horaSalida: horaS
          }).then(() => {
            this.mensaje = 'Salida registrada con éxito ✅';
            this.salidaRegistrada = true;
            this.horaSalida = horaS;
          });
        }
      });
    });
  }

  verificarEstadoHoy() {
    runInInjectionContext(this.injector, () => {
      const storageUser = localStorage.getItem('user');
      const userData = storageUser ? JSON.parse(storageUser) : null;
      const emailBusqueda = userData?.email || "Empleada1@gmail.com";

      this.firestore.collection('asistencias', ref => 
        ref.where('email', '==', emailBusqueda).orderBy('timestamp', 'desc')
      ).valueChanges().subscribe((data: any[]) => {
        this.historial = data;
        const hoy = new Date().toLocaleDateString();
        const registroHoy = data.find(r => r.fecha === hoy);
        
        if (registroHoy) {
          this.entradaRegistrada = true;
          this.horaEntrada = registroHoy.horaEntrada;
          if (registroHoy.horaSalida) {
            this.salidaRegistrada = true;
            this.horaSalida = registroHoy.horaSalida;
          }
        }
      });
    });
  }
}