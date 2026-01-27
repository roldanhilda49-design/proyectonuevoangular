import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Productomodels } from '../models/productomodels';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  constructor(private firestore: AngularFirestore, private injector: Injector,
    private storage: AngularFireStorage 
    
  ) {}

async agregarProductoConImagen(producto: Productomodels, imagen: File) {
    debugger;
    const id = this.firestore.createId();
   
    const path = `productos/${id}`;
    const ref = this.storage.ref(path);

    // subir imagen
    await this.storage.upload(path, imagen);

    // obtener url
    const imagenUrl = await ref.getDownloadURL().toPromise();
    return runInInjectionContext(this.injector, () => {
      return this.firestore
        .collection('productos')
        .doc(id)
        .set({
          ...producto,
          imagenUrl,
          creadoEn: new Date(),
        });
    });
  }
  // Agregar producto con ID generado manualmente
  agregarProducto(producto: Productomodels) {
    const id = this.firestore.createId();
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection('productos').doc(id).set({
        ...producto,
        id,
        creadoEn: new Date()
      });
    });
  }

  // Obtener productos
 obtenerProductos() {
  return runInInjectionContext(this.injector, () => {
    return this.firestore
      .collection<Productomodels>('productos')
      .valueChanges({ idField: 'id' });
  });
}

eliminarProducto(id: string) {
  return runInInjectionContext(this.injector, () => {
    return this.firestore.collection('productos').doc(id).delete();
  });
}
actualizarProducto(id: string, data: Partial<Productomodels>) {
  return runInInjectionContext(this.injector, () => {
    return this.firestore.collection('productos').doc(id).update(data);
  });
}
  
}