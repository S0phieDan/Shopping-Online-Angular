import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { ProductModel } from '../model/product.model';
import { Observable } from 'rxjs';
import { OrderModel } from '../model/order.model';

@Injectable({
  providedIn: 'root'
})

export class SocketioService {
  socket;

  constructor() { }

  setupSocketConnection(): void {
    this.socket = io('http://localhost:5000');
  }

  emitData(data: ProductModel): void {
    this.socket.emit('addProduct', data);
  }

  listenForData() {
    return new Observable((observer) => {
      this.socket.on('receiveAddedProduct', (data: ProductModel) => {
        observer.next(data);
      });
    });
  }

  emitUpdateProduct(product: ProductModel): void {
    this.socket.emit('updateProduct', product);
  }

  listenForUpdatedProduct() {
    return new Observable((observer) => {
      this.socket.on('receiveUpdatedProduct', (data: ProductModel) => {
        observer.next(data);
      });
    });
  }


}
