import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Productomodels } from '../models/productomodels';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  constructor(
    private firestore: AngularFirestore,
    private injector: Injector // Agregamos el inyector global
  ) {}

  obtenerProductos(): Observable<Productomodels[]> {
    // Forzamos a Angular a ejecutar esto dentro de un contexto válido
    return runInInjectionContext(this.injector, () => {
      return this.firestore
        .collection<Productomodels>('productos')
        .valueChanges({ idField: 'id' });
    });
  }

  agregarProducto(producto: Productomodels): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      const id = this.firestore.createId();
      return this.firestore.collection('productos').doc(id).set({ ...producto, id });
    });
  }

  actualizarProducto(id: string, data: any): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection('productos').doc(id).update(data);
    });
  }

  eliminarProducto(id: string): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection('productos').doc(id).delete();
    });
  }
}