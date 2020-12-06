import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { StepperComponent } from '../stepper/stepper.component';
import { UserModel } from '../../model/user.model';
import { RegisterServiceService } from '../../services/register-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() isLoginEvent: EventEmitter<boolean> = new EventEmitter();
  @ViewChild(StepperComponent) stepper;
  isOpenPopup:boolean = false;
  isSuccess:boolean = false;
  successMessage:String = "Congratulations, your account has been successfully created.\nPlease Login.";
  errorMessage:String = "There is a user with the same data.\nCouldn't create new user!";

  constructor(private registerService:RegisterServiceService) { }

  ngOnInit(): void {

  }

  login(): void{
    this.isLoginEvent.emit(true);
  }

  receiveCreateAccountEvent(value: boolean): void{
    if(value)
    {
      const user: UserModel = {
        _id: this.stepper.id,
        email: this.stepper.email,
        password: this.stepper.password,
        city: this.stepper.city,
        street: this.stepper.street,
        first_name: this.stepper.first_name,
        last_name: this.stepper.last_name,
        isAdmin: false
      }
      this.registerService.createNewAccount(user).subscribe((data: boolean) => {
        if(data)
        {
          this.isSuccess = true;
          this.isOpenPopup = true;
        }
        else
        {
          this.isSuccess = false;
          this.isOpenPopup = true;
        }
      });
    }
  }

  receivePopupEvent(value:boolean): void{
    this.isOpenPopup = value;
  }
}
