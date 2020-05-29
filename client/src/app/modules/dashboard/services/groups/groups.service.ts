import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user/user.service';
import { AppStatic } from '../../../../_helper/appStatic.constant';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  _apis = {
    fetchGroups: `/api/rooms`,
    createGroup: `/api/rooms`,
    getActiveGames: `/api/rooms/games/active`
  }

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) { }

  public fetchGroups() {
    let that = this;
    return that.http.get(that._apis.fetchGroups)
    .pipe(
      map((res) => {
        console.log(res);
        return res;
      }),
      catchError(that.handleError)
    );
  }

  public createGroup(val) {
    let that = this;
    return that.http.post(that._apis['createGroup'], val, {observe: 'response'})
      .pipe(
        map((res) => {
          console.log(res);
          return res.body;
        }),
        catchError(that.handleError)
      );
  }

  public startGame(grpId) {
    if(grpId) {
      let role = this.userService.getUserRole();
      let url = `${AppStatic.defaultRoutes[role].quiz}/${grpId}`;

      this.router.navigate([url]);
    }
  }

  public getAllActiveGames() {
    let that = this;
    return that.http.get(that._apis.getActiveGames)
      .pipe(
        map((res) => {
          console.log(res);
          return res;
        }),
        catchError(that.handleError)
      );
  }

  private handleError(error: HttpErrorResponse){
    // return an observable with the error to change the view accordingly.
    return of(error);
  }
}
