import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { OrderDetailsServiceService } from '../../services/order-details-service.service';
import { RegisterServiceService } from '../../services/register-service.service';
import { UserModel } from '../../model/user.model';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { OrderModel } from '../../model/order.model';
import { Router } from '@angular/router';
import { ValidationServiceService } from '../../services/validation-service.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrderDetailsComponent implements OnInit {
  first_name: String = "";
  last_name: String = "";
  user_id: Number;
  city: String = "";
  isCityValid: boolean = true;
  street: String = "";
  isStreetValid: boolean = true;
  inputCity: String = "";
  inputStreet: String = "";
  israelCities: String[];
  shippingDate: string;
  isShippingDateValid: boolean = true;
  searchCitiesArray: String[];
  paymentMethod: String;
  fullScheduleDays: any = [20, 15, 3];
  currentDate: string = new Date(Date.now()).toISOString().split('T')[0];
  @Input() totalPrice: Number;
  @Output() confirmOrderEvent = new EventEmitter<any>();
  orderDates: string[] = [];
  errorMessage: String;
  message: String = 'Input fields are invalid or empty!';

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    let className = '';
    if (view === 'month') {
      const date = cellDate.toLocaleDateString('en-GB');

      for (let i = 0; i < this.orderDates.length; i++) {
        if (date.localeCompare(this.orderDates[i]) === 0) {
          className = 'full';
        }
      }
    }
    return className;
  }

  myFilter = (d: Date): boolean => {
    const date = d.toLocaleDateString('en-GB');
    let filter = true;

    for (let i = 0; i < this.orderDates.length; i++) {
      if (date.localeCompare(this.orderDates[i]) === 0) {
        filter = false;
      }
    }
    return filter;
  }

  constructor(private orderDetailsService: OrderDetailsServiceService,
    private registerService: RegisterServiceService,
    private router: Router,
    private validationService: ValidationServiceService) { }

  ngOnInit(): void {
    this.orderDetailsService.getUserData().subscribe((data: UserModel) => {
      if (data)
        this.first_name = data.first_name;
      this.last_name = data.last_name;
      this.user_id = data._id;
      this.city = data.city;
      this.street = data.street;

    });

    this.registerService.getIsraelCities().subscribe((cities) => {
      if (cities) {
        const records = cities.result.records;
        this.israelCities = records.map(record => record.Name);
        this.searchCitiesArray = this.israelCities;
      }
    });

    this.orderDetailsService.getOrderDates().subscribe((list: string[]) => {
      for (let i = 0; i < list.length - 1; i++) {
        let count = 1;
        for (let j = i + 1; j < list.length; j++) {
          if (list[i] === list[j]) {
            count++;
          }
        }
        if (count > 3) {
          this.orderDates.push(list[i]);
        }
      }
    })
  }

  doubleClickCity(): void {
    this.inputCity = this.city;
  }

  doubleClickStreet(): void {
    this.inputStreet = this.street;
  }

  changeCity(value: string): void {
    if (value) {
      this.inputCity = value;
      this.isCityValid = this.validationService.checkString(value);
      this.errorMessage = "";
    }
  }

  setSearchCityName(value: string): void {
    this.inputCity = value;
    this.setSearchArray(value);
    this.isCityValid = this.validationService.checkString(value);
    this.errorMessage = "";
  }

  setSearchArray(value: string): void {
    this.searchCitiesArray = [];
    this.israelCities.forEach(city => {
      if (city.toLowerCase().includes(value.toLowerCase())) {
        this.searchCitiesArray.push(city);
      }
    })
  }

  setStreet(value: string): void {
    this.inputStreet = value;
    this.isStreetValid = this.validationService.checkString(value);
    this.errorMessage = "";
  }

  setShippingDate(value: Date): void {
    if (value && value instanceof Date) {
      this.shippingDate = value.toLocaleDateString('en-GB');
      this.isShippingDateValid = this.validationService.checkDate(value);
      this.errorMessage = "";
    }
  }

  setPaymentMethod(value: String): void {
    if (value) {
      this.paymentMethod = value;
    }
  }

  confirmOrder(): void {
    if (this.city && this.street && this.shippingDate && this.paymentMethod && this.isStreetValid && this.isCityValid && this.isShippingDateValid) {
      const order: OrderModel = {
        user_id:
        {
          _id: this.user_id
        },
        totalPrice: this.totalPrice,
        city: this.city,
        street: this.street,
        shippingDate: this.shippingDate,
        paymentMethod: this.paymentMethod
      }

      this.orderDetailsService.createNewOrder(order).subscribe((data) => {
        if (data) {
          this.confirmOrderEvent.emit({ data: data, isOrderComplete: true });
        }
        else {
          this.errorMessage = 'There was a problem while creating your order.\nPlease try again.';
        }
      });

    }
    else {
      this.errorMessage = this.message;
      this.isCityValid = false;
      this.isStreetValid = false;
      this.isShippingDateValid = false;
      this.paymentMethod = "";
    }
  }

  receivePopupEvent(value: boolean): void {
    if (value === false)
      this.errorMessage = "";
  }
}
