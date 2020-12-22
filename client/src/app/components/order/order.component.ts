import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  totalPrice: number;
  order_id: String;
  orderCreationDate: String;
  shippingDate: String;
  isOrderComplete: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  receiveTotalSumEvent(value: number): void {
    this.totalPrice = value;
  }

  receiveConfirmOrderEvent(value: any): void {
    this.isOrderComplete = value.isOrderComplete;
    const { order_id, createdAt, totalPrice, shippingDate } = value.data;
    this.order_id = order_id;
    this.orderCreationDate = new Date(createdAt).toLocaleDateString('en-GB');
    this.totalPrice = totalPrice;
    this.shippingDate = shippingDate;
  }

}
