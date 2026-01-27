import { Injectable, runInInjectionContext, Injector } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Categoriamodels } from '../models/categoriamodels';
@Injectable({
  providedIn: 'root',
})
export class Categoria {
  constructor(private firestore: AngularFirestore,
    private injector: Injector
  ){}
  ObtenerCategorias(){
    return runInInjectionContext(this.injector, () => {
      return this.firestore
      .collection<Categoriamodels>('categorias')
      .valueChanges({idField: 'id'});
    });
  }
  agregarCategoria(categoria: Categoriamodels) {
    const id = this.firestore.createId();
    return runInInjectionContext(this.injector, () => {
      return this.firestore
        .collection('categorias')
        .doc(id)
        .set({
          ...categoria,
          activo: true,
          creadoEn: new Date(),
        });
    });
  }
  actualizarCategoria(id: string, data: Partial<Categoriamodels>) {
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection('categorias').doc(id).update(data);
    });
  }
  eliminarCategoria(id:string){
    return runInInjectionContext(this.injector, () => {
      return this.firestore.collection('categorias').doc(id).delete();

    });
  }
}
