import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LoginServiceService } from '../../services/login-service.service';
import { Router } from '@angular/router';
import { ResponseModel } from '../../model/response.model'
import { SharedServiceService } from '../../services/shared-service.service';
import { CartModel } from '../../model/cart.model';
import { ValidationServiceService } from '../../services/validation-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() isRegisterEvent: EventEmitter<boolean> = new EventEmitter();
  email: String = "";
  isEmailValid: boolean = true;
  isPasswordValid: boolean = true;
  password: String = "";
  isLogged: boolean = false;
  isNewCart: boolean;
  cartTotalPrice: Number;
  cartCreationDate: String;
  isAdmin: boolean = false;
  orderCreated: String;
  orderPrice: Number;
  shippingDate: String;
  welcomeMessage: boolean;
  errorMessage: String;
  message: String = 'Email/password are invalid or empty!';

  constructor(private loginService: LoginServiceService, private router: Router, private sharedService: SharedServiceService, private validationService: ValidationServiceService) { }

  ngOnInit(): void {
    this.loginService.checkAuthorization().subscribe((data: ResponseModel) => {
      if (data.success) {
        if (data.response.isAdmin) {
          this.router.navigate(['/store-management']);
        }
        else {
          this.isLogged = true;

          this.loginService.getCartDetails().subscribe((data: CartModel) => {
            const { totalPrice, cartCreatedAt, emptyCart } = data;

            if (cartCreatedAt) {
              this.cartTotalPrice = totalPrice;
              this.cartCreationDate = new Date(cartCreatedAt).toLocaleDateString('en-GB');
              this.isNewCart = false;
            }
            else if (emptyCart) {
              this.isNewCart = true;


              this.loginService.getOrderDetails().subscribe((data: any) => {
                if (data) {
                  this.welcomeMessage = false;
                  const { totalPrice, shippingDate, createdAt } = data;
                  this.orderPrice = totalPrice;
                  this.orderCreated = new Date(createdAt).toLocaleDateString('en-GB');
                  this.shippingDate = shippingDate;
                }
                else {
                  this.welcomeMessage = true;
                }
              })
            }
          })

        }
        this.sharedService.changeUserData(data);
      }
      else {
        this.isLogged = false;
        this.sharedService.changeUserData(
          {
            success: true,
            response:
            {
              name: "Guest",
              email: "",
              isAdmin: false
            }
          }
        )
      }
    });
  }

  register(): void {
    this.isRegisterEvent.emit(true);
  }

  setEmail(value: string) {
    this.isEmailValid = this.validationService.checkEmail(value);
    this.email = value;
    this.errorMessage = "";
  }

  setPassword(value: string) {
    this.isPasswordValid = this.validationService.checkPassword(value);
    this.password = value;
    this.errorMessage = "";
  }

  checkValidation(): boolean {
    if (this.isEmailValid && this.isPasswordValid && this.email && this.password)
      return true;
    else {
      this.isPasswordValid = false;
      this.isEmailValid = false;
      this.errorMessage = this.message;
      return false;
    }
  }

  receivePopupEvent(value: boolean): void {
    if (value === false)
      this.errorMessage = "";
  }

  login() {
    if (this.checkValidation()) {
      this.loginService.loginUser(this.email, this.password).subscribe((data: ResponseModel) => {
        if (data) {
          if (data.success) {
            this.isLogged = true;
            this.email = "";
            this.password = "";
            this.sharedService.changeUserData(data);

            if (data.response.isAdmin) {
              this.router.navigate(['/store-management']);
            }
            else {
              this.loginService.createNewCart().subscribe((data: ResponseModel) => {
                if (data) {
                  const { success } = data;
                  if (success) {
                    this.loginService.getCartDetails().subscribe((data: CartModel) => {
                      const { totalPrice, cartCreatedAt, emptyCart } = data;
                      if (cartCreatedAt) {
                        this.cartTotalPrice = totalPrice;
                        this.cartCreationDate = new Date(cartCreatedAt).toLocaleDateString('en-GB');
                        this.isNewCart = false;
                      }
                      else if (emptyCart) {
                        this.isNewCart = true;

                        this.loginService.getOrderDetails().subscribe((data: any) => {
                          if (data) {
                            this.welcomeMessage = false;
                            const { totalPrice, shippingDate, createdAt } = data;
                            this.orderPrice = totalPrice;
                            this.orderCreated = new Date(createdAt).toLocaleDateString('en-GB');
                            this.shippingDate = shippingDate;
                          }
                          else {
                            this.welcomeMessage = true;
                          }
                        })
                      }
                    })
                  }
                }
              })
            }
          }
          else {
            this.errorMessage = this.message;
          }

        }
      })
    }
  }

  goToStore() {
    this.router.navigate(['/store']);
  }

}
