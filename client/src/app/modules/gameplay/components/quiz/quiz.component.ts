import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  @Input('admin') isAdminConsole: Boolean;
  question = {
    "createdBy": "admin",
    "_id": "5ec68048c9962197d39e658a",
    "forGroup": "qbank",
    "level": 1,
    "options": [
        {
            "_id": "5ec68048c9962197d39e658b",
            "text": "G",
            "value": "g"
        },
        {
            "_id": "5ec68048c9962197d39e658c",
            "text": "J",
            "value": "j"
        },
        {
            "_id": "5ec68048c9962197d39e658d",
            "text": "U",
            "value": "u"
        },
        {
            "_id": "5ec68048c9962197d39e658e",
            "text": "V",
            "value": "v"
        },
        {
            "_id": "5ec68048c9962197d39e658f",
            "text": "W",
            "value": "w"
        },
        {
            "_id": "5ec68048c9962197d39e6590",
            "text": "X",
            "value": "x"
        }
    ],
    "question": "Arrange these English alphabets in order",
    "type": "f3",
    "createdAt": "2020-05-21T13:21:12.025Z",
    "__v": 0
  }

  answer = [];
  constructor() { }

  ngOnInit() {

  }
  
  choose(opt) {
    if(this.isClicked(opt)) {
      this.answer.splice(this.answer.indexOf(opt), 1);
    }
    else  {
      this.answer.push(opt);
    }
  }

  isClicked(opt) {
    if(this.answer.indexOf(opt)>-1){
      return true;
    }
    return false;
  }
}
