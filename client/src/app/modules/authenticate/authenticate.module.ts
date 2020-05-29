import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthenticateRoutingModule } from './authenticate-routing.module';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BasicAuthInterceptor } from '../../_helper/interceptor';
import { SharedModule } from '../shared/shared.module';
import { SignupComponent } from './components/signup/signup.component';


@NgModule({
  declarations: [LoginComponent, SignupComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true }
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthenticateRoutingModule,
    SharedModule
  ]
})
export class AuthenticateModule { }
