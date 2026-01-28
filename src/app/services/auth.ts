import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from '../services/usuario'; 

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private usuarioService: Usuario
  ) {}

  /**
   * 1. Registro en Firebase Auth
   */
  registrar(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  /**
   * 2. GUARDAR USUARIO EN FIRESTORE
   * Cambiamos a una referencia directa de documento para evitar el error NG0203
   */
  GuardarUsuario(usuario: any) {
    // Usar doc(`coleccion/id`) es más estable en contextos asíncronos
    return this.firestore.doc(`usuarios/${usuario.uid}`).set(usuario);
  }

  /**
   * 3. Login
   */
  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  /**
   * 4. Logout
   */
  logout() {
    return this.afAuth.signOut();
  }

  /**
   * 5. Obtener datos (Roles y perfil)
   */
  ObtenerUsuario(uid: string) {
    return this.usuarioService.obtenerUsuario(uid);
  }

  /**
   * 6. Gestión de Usuarios
   */
  getUsuarios() {
    return this.firestore.collection('usuarios').valueChanges({ idField: 'uid' });
  }

  /**
   * 7. Actualizar estado
   */
  actualizarEstadoUsuario(uid: string, estado: boolean) {
    return this.firestore.doc(`usuarios/${uid}`).update({
      activo: estado
    });
  }
}