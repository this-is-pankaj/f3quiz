import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserService } from '../../../shared/services/user/user.service';
import { AppStatic } from '../../../../_helper/appStatic.constant';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  _apis = {
    login: '/api/authenticate/login',
    signup: '/api/authenticate/signup'
  }

  private navigationMapper = {
    admin: 'admin',
    superAdmin: 'admin',
    reception: 'reception',
    user: 'user',
    default: 'user'
  };
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) { 
    if(userService.getUserId()) {
      const role = userService.getUserRole();
      router.navigate([AppStatic.defaultRoutes[role].dashboard]);
    }
  }

  /**
   * Method to submit the credentials and attempt loggin in a user.
   *
   * @param {Object} creds - Credentials with login & password.
   * @returns
   * @memberof AuthenticateService
   */
  login(creds) {
    let that = this;
    return that.http.post(that._apis['login'], creds, {observe: 'response'})
      .pipe(
        map((res) => {
          that.saveLoggedInInfo({id: res.body['data']['id'], role: res.body['data']['role']})
          return res.body;
        }),
        catchError(that.handleError)
      );
  }

  signup(user) {
    let that = this;
    return that.http.post(that._apis.signup, user, {observe: 'response'})
      .pipe(
        map((res)=>{
          that.saveLoggedInInfo({id: res.body['data']['id'], role: res.body['data']['role']})
          return res.body;
        }),
        catchError(that.handleError)
      )
  }

  /**
   * Error Handling for API's
   *
   * @private
   * @param {HttpErrorResponse} error
   * @returns
   * @memberof AuthenticateService
   */
  private handleError(error: HttpErrorResponse) {
    // return an observable with the error to change the view accordingly.
    return of(error);
  }

  private saveLoggedInInfo(info) {
    this.userService.setUserInfo(info);
  }
}
