import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { RegisterServiceService } from '../../services/register-service.service';
import { ValidationServiceService } from '../../services/validation-service.service';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})
export class StepperComponent implements OnInit {
  id:Number;
  isIdValid:boolean=true;
  email:String;
  isEmailValid: boolean=true;
  password:String;
  isPasswordValid:boolean=true;
  confirmPassword:String;
  isConfirmPasswordValid:boolean=true;
  isNextStep:boolean = false;
  isOpenList:boolean = false;
  city:String="";
  isCityValid:boolean=true;
  street:String;
  isStreetValid:boolean=true;
  first_name:String;
  isFirstNameValid:boolean=true;
  last_name:String;
  isLastNameValid:boolean=true;
  @Output() createAccountEvent: EventEmitter<boolean> = new EventEmitter();
  israelCities:String[];
  searchCitiesArray:String[];
  errorMessage:String;
  message:String = 'Input fields are invalid or empty!';

  constructor(private registerService:RegisterServiceService, private validationService:ValidationServiceService) { }

  ngOnInit(): void {
    this.registerService.getIsraelCities().subscribe((cities) => {
      if(cities)
      {
        const records = cities.result.records;
        this.israelCities = records.map(record => record.Name);
        this.searchCitiesArray = this.israelCities;
      }
    });
  }

  continueToNextStep(): void{
    if(this.id && this.email && this.password && this.confirmPassword && this.isIdValid && this.isEmailValid && this.isPasswordValid && this.isConfirmPasswordValid){
      this.isNextStep = true;
    }
    else
    {
      this.isIdValid = false;
      this.isEmailValid = false;
      this.isPasswordValid = false;
      this.isConfirmPasswordValid = false;
      this.errorMessage = this.message;
    }
  }

  createAccount(): void {
    if(this.id && this.email && this.password && this.confirmPassword && this.city && this.street && this.first_name && this.last_name)
    {
      if(this.isIdValid && this.isEmailValid && this.isPasswordValid && this.confirmPassword && this.isCityValid && this.isStreetValid && this.isFirstNameValid && this.isLastNameValid)
      {
        this.createAccountEvent.emit(true);
        this.isNextStep = false;
      }
      else
      {
        this.isCityValid = false;
        this.isStreetValid = false;
        this.isFirstNameValid = false;
        this.isLastNameValid = false;
        this.errorMessage = this.message;
      }
    }
    else
      {
        this.isCityValid = false;
        this.isStreetValid = false;
        this.isFirstNameValid = false;
        this.isLastNameValid = false;
        this.errorMessage = this.message;
      }
  }

  setId(value: number): void{
    this.id = value;
    this.isIdValid = this.validationService.checkId(value);
    this.errorMessage = "";
  }

  setEmail(value: string): void{
    this.email = value;
    this.isEmailValid = this.validationService.checkEmail(value);
    this.errorMessage = "";
  }

  setPassword(value: string): void{
    this.password = value;
    this.isPasswordValid = this.validationService.checkPassword(value);
    this.errorMessage = "";
  }

  setConfirmPassword(value: string): void{
    this.confirmPassword = value;
    this.isConfirmPasswordValid = this.validationService.checkConfirmPassword(this.password, this.confirmPassword);
    this.errorMessage = "";
  }

  setStreet(value:string): void {
    this.street = value;
    this.isStreetValid = this.validationService.checkString(value);
    this.errorMessage = "";
  }

  setFirstName(value:string): void {
    this.first_name = value;
    this.isFirstNameValid = this.validationService.checkString(value);
    this.errorMessage = "";
  }

  setLastName(value:string): void {
    this.last_name = value;
    this.isLastNameValid = this.validationService.checkString(value);
    this.errorMessage = "";
  }

  receivePopupEvent(value: boolean): void{
    if(value === false)
      this.errorMessage = "";
  }

  openCitiesList(): void{
    this.isOpenList = !this.isOpenList;
  }

  setSearchCityName(value:string): void {
    this.city = value;
    this.isCityValid = this.validationService.checkString(value);
    this.errorMessage = "";
    this.setSearchArray(value);
    this.isOpenList = true;
  }

  setSearchArray(value:string): void {
    this.searchCitiesArray = [];
    this.israelCities.forEach(city => {
      if(city.toLowerCase().includes(value.toLowerCase()))
      {
        this.searchCitiesArray.push(city);
      }
    })
  }

  setSelectedCity(value:string): void {
    this.city = value;
    this.isCityValid = this.validationService.checkString(value);
    this.errorMessage = "";
  }

}
