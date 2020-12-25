import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../../services/login-service.service';
import { SharedServiceService } from '../../services/shared-service.service';
import { Router } from '@angular/router';
import { ResponseModel } from '../../model/response.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  name: String = "Guest";
  email: String;

  constructor(private loginService: LoginServiceService, private router: Router, private sharedService: SharedServiceService) { }

  ngOnInit(): void {
    this.subscription.add(
      this.loginService.checkAuthorization().subscribe((data: ResponseModel) => {
        if (data.success) {
          const { response } = data;
          const { email, name } = response;
          this.name = name;
          this.email = email;
        }
      })
    )
    
    this.subscription.add(
      this.sharedService.currentUserData.subscribe(data => {
        if (data) {
          if (data.success) {
            const { response } = data;
            const { email, name } = response;
            this.name = name;
            this.email = email;
          }
        }
      })
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  signOut(): void {

    this.loginService.destroySession().subscribe((data: ResponseModel) => {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/']);
    });
  }

}
