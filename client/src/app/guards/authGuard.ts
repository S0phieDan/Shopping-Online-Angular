import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../model/response.model';

@Injectable()

export class AuthGuard implements CanActivate {
    constructor(private route: Router) { }

    async canActivate() {
        const response = await fetch('/api/authorization', {
            mode: 'cors',
            credentials: 'include'
        });
        let dataJson: ResponseModel = await response.json();

        if (!dataJson.success) {
            this.route.navigate(['']);
        }
        else if (dataJson.response.isAdmin) {
            dataJson.success = false;
            this.route.navigate(['']);
        }
        return dataJson.success;
    }
}