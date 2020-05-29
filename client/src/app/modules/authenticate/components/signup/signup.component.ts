import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticateService } from '../../services/authenticate/authenticate.service';
import { Router } from '@angular/router';
import { F3FormsService } from '../../../shared/services/f3Forms/f3-forms.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  isErroneous = this.f3qFormService.isErroneous;
  constructor(private formBuilder: FormBuilder, private authenticateService: AuthenticateService, private router: Router, private f3qFormService: F3FormsService) {
    this.generateFormFields();
   }

  ngOnInit() {
  }

  generateFormFields(){
    const name =  {
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-z]*')]],
      middleName: ['', [Validators.pattern('[a-zA-z]*')]],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-z]*')]]
    }
    let that = this,
      formTemplates = {
        formFields : {
          "name": this.formBuilder.group(name),
          "phone": ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
          "email": ['', [Validators.required, Validators.email]],
          "password": ['', [Validators.required, Validators.minLength(6)]],
        }
      };

    that.signupForm = that.formBuilder.group(formTemplates['formFields']);
  }

  test(){
    console.log(1)
  }

  signup() {
    let that = this;
    if(!that.signupForm.valid) {
      return;
    }
    let user = that.signupForm.value;
    that.authenticateService.signup(user)
      .toPromise()
      .then((data)=>{
        let url = data['data']['redirectionURL'];
        that.router.navigate([url]);
      })
      .catch((err)=>{
        console.log(err);
      })
  }
}
