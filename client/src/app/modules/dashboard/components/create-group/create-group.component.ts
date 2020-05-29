import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GroupsService } from '../../services/groups/groups.service';
import { F3FormsService } from '../../../shared/services/f3Forms/f3-forms.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  createGroupForm: FormGroup;
  isFormOpen: Boolean = false;
  isErroneous = this.f3qFormService.isErroneous;
  
  constructor(
    private formBuilder: FormBuilder,
    private groupService: GroupsService,
    private f3qFormService: F3FormsService
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    let content = {
      "name": ['', Validators.required]
    };

    this.createGroupForm = this.formBuilder.group(content);
  }

  showForm() {
    this.toggleFormView(true);
  }
  
  closeForm() {
    // Prevent for save
    event.preventDefault();
    this.toggleFormView(false);
  }

  toggleFormView(state?) {
    this.isFormOpen = state? state : !this.isFormOpen;
  }

  save() {
    let that = this;
    if(!that.createGroupForm.valid) {
      return;
    }
    let ques = that.createGroupForm.value;
    that.groupService.createGroup(ques)
      .toPromise()
      .then((data)=>{
        if(data['status']  === 200) {
          that.closeForm();
          alert("Group Created Successfully");
        }
        else {
          alert("Failed to Create Group");
        }
      })
      .catch((err)=>{
        console.log(err);
        alert("Failed to Create Group");
      })
  }

}
