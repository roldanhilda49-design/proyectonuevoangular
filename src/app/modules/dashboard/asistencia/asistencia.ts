import { Component, OnInit, OnDestroy, Injector, runInInjectionContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { take } from 'rxjs/operators';

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

  entradaRegistrada = false;
  salidaRegistrada = false;
  horaEntrada: string | null = null;
  horaSalida: string | null = null;
  mensaje: string = '';
  historial: any[] = [];
  
  // VARIABLE CLAVE: Guarda el ID del documento para que la salida lo encuentre sí o sí
  documentoIdActual: string | null = null;

  constructor(
    private firestore: AngularFirestore,
    private injector: Injector 
  ) {}

  ngOnInit() {
    this.timer = setInterval(() => {
      this.horaActual = new Date().toLocaleTimeString();
    }, 1000);

    setTimeout(() => {
      this.verificarEstadoHoy();
    }, 500);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  registrarEntrada() {
    runInInjectionContext(this.injector, () => {
      const storageUser = localStorage.getItem('user');
      const userData = storageUser ? JSON.parse(storageUser) : null;
      const emailFinal = userData?.email || "Empleada1@gmail.com";
      
      const hoy = new Date();
      const fechaTexto = hoy.toLocaleDateString();
      const horaTexto = hoy.toLocaleTimeString();

      this.firestore.collection('asistencias').add({
        email: emailFinal,
        fecha: fechaTexto,
        horaEntrada: horaTexto,
        horaSalida: null, // Se crea vacío para llenarlo después
        timestamp: Date.now()
      }).then((docRef) => {
        // AQUÍ GUARDAMOS EL ID SECRETO DE FIREBASE
        this.documentoIdActual = docRef.id;
        
        this.mensaje = 'Entrada registrada con éxito ✅';
        this.entradaRegistrada = true;
        this.horaEntrada = horaTexto;
      }).catch(err => {
        this.mensaje = 'Error al guardar entrada ❌';
      });
    });
  }

  registrarSalida() {
    this.mensaje = 'Actualizando base de datos...';
    
    runInInjectionContext(this.injector, () => {
      const horaS = new Date().toLocaleTimeString();

      // RUTA A: Si tenemos el ID guardado en memoria (lo más rápido)
      if (this.documentoIdActual) {
        this.firestore.collection('asistencias').doc(this.documentoIdActual).update({
          horaSalida: horaS
        }).then(() => {
          this.mensaje = 'Salida registrada con éxito ✅';
          this.salidaRegistrada = true;
          this.horaSalida = horaS;
        });
      } 
      // RUTA B: Si no hay ID (refrescaste la página), lo buscamos por el último registro
      else {
        const storageUser = localStorage.getItem('user');
        const userData = storageUser ? JSON.parse(storageUser) : null;
        const emailFinal = userData?.email || "Empleada1@gmail.com";

        this.firestore.collection('asistencias', ref => 
          ref.where('email', '==', emailFinal).orderBy('timestamp', 'desc').limit(1)
        ).get().pipe(take(1)).subscribe(snapshot => {
          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            doc.ref.update({ horaSalida: horaS }).then(() => {
              this.mensaje = 'Salida registrada con éxito ✅';
              this.salidaRegistrada = true;
              this.horaSalida = horaS;
            });
          } else {
            this.mensaje = 'No se encontró registro para actualizar ❌';
          }
        });
      }
    });
  }

  verificarEstadoHoy() {
    runInInjectionContext(this.injector, () => {
      const storageUser = localStorage.getItem('user');
      const userData = storageUser ? JSON.parse(storageUser) : null;
      const emailBusqueda = userData?.email || "Empleada1@gmail.com";

      this.firestore.collection('asistencias', ref => 
        ref.where('email', '==', emailBusqueda).orderBy('timestamp', 'desc')
      ).valueChanges({ idField: 'id' }).subscribe((data: any[]) => {
        this.historial = data;
        const hoy = new Date().toLocaleDateString();
        const registroHoy = data.find(r => r.fecha === hoy);
        
        if (registroHoy) {
          // Si el sistema encuentra que hoy ya entraste, recupera el ID automáticamente
          this.documentoIdActual = registroHoy.id;
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