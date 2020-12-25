import { Component, OnInit } from '@angular/core';
import { StoreDataServiceService } from '../../services/store-data-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-store-data',
  templateUrl: './store-data.component.html',
  styleUrls: ['./store-data.component.css']
})
export class StoreDataComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  productsInStore: Number;
  orders: Number;

  constructor(private storeDataService: StoreDataServiceService) { }

  ngOnInit(): void {
    this.subscription.add(
      this.storeDataService.getAmountOfProducts().subscribe((value: Number) => {
        if (value)
          this.productsInStore = value;
      })
    )

    this.subscription.add(
      this.storeDataService.getAmountOfOrders().subscribe((value: Number) => {
        if (value)
          this.orders = value;
      })
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
