import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { QuestionBankService } from '../../services/questionBank/question-bank.service';
import { F3FormsService } from '../../../shared/services/f3Forms/f3-forms.service';

@Component({
  selector: 'app-add-questions',
  templateUrl: './add-questions.component.html',
  styleUrls: ['./add-questions.component.scss']
})
export class AddQuestionsComponent implements OnInit {
  addQuestionForm: FormGroup;
  options: FormArray;
  isErroneous = this.f3qFormService.isErroneous;
  questionTypes = [{
    text: "Fastest Fingers First",
    value: "f3"
  }];

  questionForGroup  =  [{
    id: "qbank",
    text: "For All Groups"
  }];

  levels = [
    {
      id: 1,
      text: "Level 1"
    },
    {
      id: 2,
      text: "Level 2"
    },
    {
      id: 3,
      text: "Level 3"
    },
    {
      id: 4,
      text: "Level 4"
    }
  ]

  constructor(
    private formBuilder: FormBuilder,
    private quesService: QuestionBankService,
    private f3qFormService: F3FormsService
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    let content = {
      "type": ['f3', Validators.required],
      "forGroup": ['qbank', Validators.required],
      "question": ['',Validators.required],
      "level": ['', Validators.required],
      "options": this.formBuilder.array([this.createOptions()], Validators.minLength(4)),
      "category": ['', Validators.required],
      "reference": ['']
    };

    this.addQuestionForm = this.formBuilder.group(content);
  }

  createOptions():FormGroup {
    return this.formBuilder.group({
      "text": ['', Validators.required],
      "value": ['', Validators.required]
    });
  }

  /**
   * Method that allows user to add more options
   *
   * @memberof PostsComponent
   */
  addOptions(idx?) {
    let that = this;
    that.options = that.addQuestionForm.get('options') as FormArray;
    if(idx>=0) {
      that.options.insert(idx+1, that.createOptions());
    }
    else{
      that.options.push(that.createOptions());
    }
  }

  removeOption(idx) {
    let that = this;
    that.options = that.addQuestionForm.get('options') as FormArray;
    that.options.removeAt(idx);
  }

  save() {
    let that = this;
    if(!that.addQuestionForm.valid) {
      return;
    }
    let ques = that.addQuestionForm.value;
    that.quesService.addQuestion(ques)
      .toPromise()
      .then((data)=>{
        console.log(data)
      })
      .catch((err)=>{
        console.log(err);
      })
  }
}
