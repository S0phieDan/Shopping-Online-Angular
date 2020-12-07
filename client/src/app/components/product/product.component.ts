import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProductModel } from '../../model/product.model';
import { SharedServiceService } from '../../services/shared-service.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @Input() product: ProductModel;
  @Input() isAdminLogged: boolean;
  @Output() chooseProductEvent: EventEmitter<any> = new EventEmitter();
  @Output() updateProductEvent: EventEmitter<boolean> = new EventEmitter();
  isPopup: boolean = false;
  quantity: number = 1;

  constructor(private sharedService: SharedServiceService) { }

  ngOnInit(): void {
  }

  setQuantity(amount: number): void {
    this.quantity = amount;
  }

  chooseProduct(product: ProductModel): void {
    if (this.quantity) {
      this.chooseProductEvent.emit({ product: product, quantity: this.quantity });
      this.closePopup();
      this.quantity = 1;
    }
  }

  openPopup(): void {
    this.isPopup = true;
  }

  closePopup(): void {
    this.isPopup = false;
    this.quantity = 1;
  }

  functionTrigger(product: ProductModel): void {
    if (this.isAdminLogged) {
      this.updateProductEvent.emit(true);
      this.sharedService.updateProduct(product);
    }
    else {
      this.openPopup();
    }

  }

}
