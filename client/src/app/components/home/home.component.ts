import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isRegisterPage: boolean = false;
  isLoginPage: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  receiveIsRegisterEvent(value: boolean): void {
    if (value) {
      this.isRegisterPage = true;
      this.isLoginPage = false;
    }
  }

  receiveIsLoginEvent(value: boolean): void {
    if (value) {
      this.isLoginPage = true;
      this.isRegisterPage = false;
    }
  }
}
