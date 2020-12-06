import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent implements OnInit {
  isAdminLogged:boolean = true;
  isUpdateProductOpened: boolean = false;
  isHiddenBody:boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  receiveIsEditProductOpened(value: boolean) : void{
    if(value)
    {
      this.isHiddenBody = false;
    }
  }

  receiveCancelUpdateEvent(value: boolean) : void{
    this.isHiddenBody = true;
  }

  changeHiddenBody(): void {
    this.isHiddenBody = true;
  }
}
