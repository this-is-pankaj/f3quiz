import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class F3FormsService {

  constructor() { }

  /**
   * isErroneous : The method checks if the field is erroneous
   *
   * @param {String} field - The form control name of the field who's validation needs to be checked
   * @param {String/Array} formgrp - The formGrp name in case it is a nested field. In case of nested formgroups, pass the names as an array.
   * @returns
   * @memberof GodFormsService
   */ 
  isErroneous(formInst, field, formgrp?){
    if(formInst) {
      // If a child formgroup is defined, check for the controlname within that formgroup's controls.
      // Else return the status on the parent formgroup.
      if(formgrp) {
        let isMultiFormGrp = formgrp.length && (typeof formgrp).toLowerCase() ==='object';
        if(!isMultiFormGrp){
          return formInst.controls[formgrp]['controls'][field].touched && formInst.controls[formgrp]['controls'][field].errors;
        }
        else{
          let layer= formInst.controls;
          formgrp.forEach(grp => {
            layer = layer[grp]['controls'];
          });
          return layer[field].touched && layer[field].errors;
        }
      }
      return formInst.controls[field].touched && formInst.controls[field].errors;
    }
    else {
      return false;
    }
  };
}
