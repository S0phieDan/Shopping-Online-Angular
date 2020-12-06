import { Component, OnInit } from '@angular/core';
import { StoreDataServiceService } from '../../services/store-data-service.service';

@Component({
  selector: 'app-store-data',
  templateUrl: './store-data.component.html',
  styleUrls: ['./store-data.component.css']
})
export class StoreDataComponent implements OnInit {
  productsInStore:Number;
  orders:Number;

  constructor(private storeDataService:StoreDataServiceService) { }

  ngOnInit(): void {
    this.storeDataService.getAmountOfProducts().subscribe((value: Number) => {
      if(value)
        this.productsInStore = value;
    });

    this.storeDataService.getAmountOfOrders().subscribe((value: Number) => {
      if(value)
        this.orders = value;
    })
  }

}
