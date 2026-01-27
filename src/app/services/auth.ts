import { Injectable,Inject, runInInjectionContext } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Usuario } from '../services/usuario';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private usuarioService: Usuario,
    private firestore: AngularFirestore
  ) {}

  async registrar(email: string, password: string) {
    try {
      const cred = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = cred.user?.uid || '';

      await this.usuarioService.crearUsuario(uid, email);
      return cred;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.afAuth.signOut();
  }
  ObtenerUsuario(uid: string) {
    return this.usuarioService.obtenerUsuario(uid);
  }
  getUsuarios() {
  return this.firestore.collection('usuarios').valueChanges({ idField: 'uid' });
}

// Actualizar el estado de un usuario por su ID
actualizarEstadoUsuario(uid: string, estado: boolean) {
  return this.firestore.collection('usuarios').doc(uid).update({
    activo: estado
  });
}
}
