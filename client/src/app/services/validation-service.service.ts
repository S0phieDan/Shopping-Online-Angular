import { Injectable } from '@angular/core';
import { CategoryModel } from '../model/category.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationServiceService {
  maxLength:Number = 50;

  constructor() { }

  checkEmail(email: String): boolean {
    const email_pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if(email.match(email_pattern))
      return true;
    return false;
  }

  checkPassword(password: String): boolean {
    if(password.length > 0 && password.length <= this.maxLength)
      return true;
    return false;
  }

  checkConfirmPassword(password: String, confirmPassword: String): boolean{
    if(this.checkPassword(confirmPassword))
      if(password === confirmPassword)
        return true;
    return false;
  }

  checkId(id:Number): boolean {
    if(id > 0 && id.toString().length === 9)
      return true;
    return false;
  }

  checkString(value: String): boolean {
    if(value.length > 0 && value.length <= this.maxLength)
      return true;
    return false;
  }

  checkDate(value: Date): boolean {
    if(value instanceof Date)
      return true;
    return false;
  }

  checkPrice(value: Number): boolean {
    if(value > 0)
      return true;
    return false;
  }
}
