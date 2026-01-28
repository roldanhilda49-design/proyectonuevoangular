import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private listaCarrito: any[] = [];
  private _carrito = new BehaviorSubject<any[]>([]);
  carrito$ = this._carrito.asObservable();

  // Herramientas de Firebase capturadas para evitar errores de inyección context (NG0203)
  private db: any;
  private auth = inject(AngularFireAuth);

  constructor(private firestore: AngularFirestore) {
    // Capturamos la base de datos nativa en el constructor
    this.db = this.firestore.firestore;

    const guardado = localStorage.getItem('carrito');
    if (guardado) {
      this.listaCarrito = JSON.parse(guardado);
      this._carrito.next(this.listaCarrito);
    }
  }

  // --- MÉTODOS DE GESTIÓN DE CARRITO ---

  obtenerCantidadPorProducto(id: string | undefined): number {
    if (!id) return 0;
    return this.listaCarrito.find(p => p.id === id)?.cantidad || 0;
  }

  agregar(producto: any) {
    if (!producto.id) return;
    const item = this.listaCarrito.find(p => p.id === producto.id);
    if (item) {
      if (item.cantidad < producto.stock) {
        item.cantidad++;
      }
    } else {
      this.listaCarrito.push({ ...producto, cantidad: 1 });
    }
    this.sincronizar();
  }

  eliminar(id: string) {
    this.listaCarrito = this.listaCarrito.filter(p => p.id !== id);
    this.sincronizar();
  }

  limpiarCarrito() {
    this.listaCarrito = [];
    this.sincronizar();
    localStorage.removeItem('carrito');
  }

  // --- OPERACIÓN FINAL CON EMAIL DEL CLIENTE ---

  async finalizarCompra(total: number): Promise<boolean> {
    if (this.listaCarrito.length === 0) return false;

    try {
      // 1. Obtener el usuario autenticado para sacar el Email y UID
      const user = await firstValueFrom(this.auth.user);
      
      const batch = this.db.batch();
      // Usamos el ID de Firebase para el pedido o uno aleatorio
      const pedidoId = this.firestore.createId(); 
      const pedidoRef = this.db.collection('pedidos').doc(pedidoId);
      
      const pedido = {
        id: pedidoId,
        clienteUid: user?.uid || 'anonimo',
        clienteEmail: user?.email || 'desconocido@mail.com', // <--- EMAIL AGREGADO
        fecha: new Date().toISOString(),
        items: [...this.listaCarrito],
        total: total,
        estado: 'PENDIENTE'
      };

      // Agregar el pedido al lote
      batch.set(pedidoRef, pedido);

      // Actualizar stocks de productos en el mismo lote
      for (const p of this.listaCarrito) {
        if (p.id) {
          const prodRef = this.db.collection('productos').doc(p.id);
          batch.update(prodRef, {
            stock: p.stock - p.cantidad
          });
        }
      }

      // 2. Ejecutar todo de forma atómica
      await batch.commit();

      this.limpiarCarrito();
      return true;

    } catch (error) {
      console.error("Error al finalizar compra con datos de usuario:", error);
      return false;
    }
  }

  private sincronizar() {
    this._carrito.next(this.listaCarrito);
    localStorage.setItem('carrito', JSON.stringify(this.listaCarrito));
  }
}