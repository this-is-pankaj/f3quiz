import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticateService } from '../../services/authenticate/authenticate.service';
import { Router } from '@angular/router';
import { F3FormsService } from '../../../shared/services/f3Forms/f3-forms.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginFailed: Boolean = false;
  isErroneous = this.f3qFormService.isErroneous;
  constructor(private formBuilder: FormBuilder, private authenticateService: AuthenticateService, private router: Router, private f3qFormService: F3FormsService) { 
    this.generateFormFields();
  }

  ngOnInit() {
  }

  /**
   * Method to generate form fields and form template
   *
   * @memberof LoginFormComponent
   */
  generateFormFields() {
    let that = this,
      formTemplates = {
        formFields : {
          "login": ['', [Validators.required]],
          "password": ['', [Validators.required, Validators.minLength(6)]]
        }
      };

    that.loginForm = that.formBuilder.group(formTemplates['formFields']);
  }

  login() {
    let that = this;
    if(!that.loginForm.valid) {
      return;
    }
    let creds = that.loginForm.value;
    that.authenticateService.login(creds)
      .toPromise()
      .then((data)=>{
        if(data['status'] === 200) {
          let url = data['data']['redirectionURL'];
          that.router.navigate([url]);
        }
      })
      .catch((err)=>{
        console.log(err);
      })
  }

  
}
