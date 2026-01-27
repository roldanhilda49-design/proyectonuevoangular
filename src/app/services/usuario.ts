import { Injectable, runInInjectionContext, Injector  } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { Observable } from 'rxjs';
import { Usuarioo } from '../models/usuario.model';
@Injectable({
  providedIn: 'root',
})
export class Usuario {
   constructor(private firestore:AngularFirestore,
               private Injector: Injector
   ){}
   crearUsuario(uid:string, email:string){
    return runInInjectionContext(this.Injector, () => {
       return this.firestore.collection('usuarios').doc(uid).set({
      email,
      rol:'usuario',
      fecha_registro:new Date(),

    });
    
    });
   }

   obtenerUsuario(uid: string) {
    return runInInjectionContext(this.Injector, () =>  {
      return this.firestore.collection('usuarios').doc(uid).valueChanges();
    });
   }
  ObtenerUsuarios(): Observable<Usuarioo[]> {
    return runInInjectionContext(this.Injector, () => {
      return this.firestore.collection<Usuarioo>('usuarios').snapshotChanges().pipe(
        map((actions) => {
         
          return actions.map((a) => {
            const data = a.payload.doc.data() as Usuarioo;
            const uid = a.payload.doc.id;
            return { ...data, uid };
          });
        })
      );
    });
  }
  cambiarRol(uid: string, rolNuevo: string): Promise<void> {
    debugger;
    return runInInjectionContext(this.Injector, () => {
      return this.firestore
        .collection('usuarios')
        .doc(uid)
        .update({ rol: rolNuevo });
    }).catch((error) => {
      console.log('Error al cambiar el rol:', error);
    });
  }
  desactivarUsuario(uid: string, estado: boolean): Promise<void> {
  return runInInjectionContext(this.Injector, () => {
    return this.firestore
      .collection('usuarios')
      .doc(uid)
      .update({ activo: estado });
  }).catch((error) => {
    console.error('Error al cambiar estado del usuario:', error);
  });
}


}
