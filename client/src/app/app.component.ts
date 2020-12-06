import { Component, OnInit } from '@angular/core';
import { SharedServiceService } from './services/shared-service.service';
import { ResponseModel } from './model/response.model';
import { SocketioService } from './services/socketio.service';
import { LoginServiceService } from './services/login-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  name: String = "Guest";
  email: String;
  data:ResponseModel;

  constructor(private sharedService:SharedServiceService, 
              private socketService:SocketioService, 
              private loginService:LoginServiceService,
              private router:Router
              ) { }

  ngOnInit(): void {
    this.loginService.checkAuthorization().subscribe((data: ResponseModel) => {
      if(data.success)
      {
        const {response} = data;
        const {email, name} = response;
        this.name = name;
        this.email = email;
      }
    });
    
    this.socketService.setupSocketConnection();

    this.sharedService.currentUserData.subscribe(data => {
      if(data)
      {
        if(data.success)
        {
          const {response} = data;
          const {email, name} = response;
          this.name = name;
          this.email = email;
        }
      }
    });
  }

  signOut(): void{
    
    this.loginService.destroySession().subscribe((data: ResponseModel) => {
      this.router.navigate(['/']);
    });
  }

}
