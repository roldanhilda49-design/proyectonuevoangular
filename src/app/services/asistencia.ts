import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, updateDoc, doc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  constructor(private firestore: Firestore) {}

  // Guarda un nuevo registro de entrada
  async registrarEntrada(userId: string, email: string) {
    const asistenciaRef = collection(this.firestore, 'asistencias');
    const hoy = new Date().toLocaleDateString();
    
    return addDoc(asistenciaRef, {
      userId,
      email,
      fecha: hoy,
      entrada: new Date().toLocaleTimeString(),
      salida: null,
      timestamp: new Date()
    });
  }

  // Busca el registro de hoy para marcar la salida
  async registrarSalida(userId: string) {
    const hoy = new Date().toLocaleDateString();
    const q = query(
      collection(this.firestore, 'asistencias'), 
      where('userId', '==', userId), 
      where('fecha', '==', hoy)
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docRef = doc(this.firestore, 'asistencias', querySnapshot.docs[0].id);
      return updateDoc(docRef, {
        salida: new Date().toLocaleTimeString()
      });
    }
  }
}