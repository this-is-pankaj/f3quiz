import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../modules/shared/services/user/user.service';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  constructor(
    private userService: UserService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with basic auth credentials if available
    const currentUserId = this.userService.getUserId();
    if (currentUserId && currentUserId.length) {
      request = request.clone({
        setHeaders: { 
          "f3q": `${currentUserId}`
        }
      });
    }

    return next.handle(request);
  }
}