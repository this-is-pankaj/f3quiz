import { Component, OnInit, Input } from '@angular/core';
import { QuizService } from '../../services/quiz/quiz.service';
import { Observable, Subscription } from 'rxjs';
import { Question } from '../../interfaces/question';
import { AppStatic } from '../../../../_helper/appStatic.constant';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  @Input('admin') isAdminConsole: Boolean;
  question: Question = this.setDefaultQuesObj();
  questionSub:  Subscription;
  options = [];
  optionsSub: Subscription;
  timer = {};
  timerSub: Subscription;
  
  appStatic = AppStatic;
  answer = [];

  private setDefaultQuesObj () {
    return {
      num: 0,
      level: undefined,
      submittedBy: undefined,
      text: undefined
    }
  }
  constructor(
    private quizService: QuizService
  ) { 
    // Subscribe to Question
    this.questionSub = this.quizService.getQuestion()
      .subscribe((q)=>{
        if(q && q.text) {
          this.question = q;
        }
        else {
          this.question = this.setDefaultQuesObj();
        }
        this.answer=[];
      });

    // Subscribe to  options
    this.optionsSub  = this.quizService.getOptionsToBeDisplayed()
      .subscribe((o)=>{
        if(o && o.length)  {
          this.options = o;
        }
        else{
          this.options  =  [];
        }
      })
      
    this.timerSub = this.quizService.getTimer()
      .subscribe((t)=>{
        this.timer =  t;
      })
  }

  ngOnInit() {

  }

  showSubmit() {
    return !this.isAdminConsole && this.quizService.isSubmitButtonActive();
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

  submitAns() {
    if(this.quizService.isSubmitButtonActive()){
      this.quizService.submitAnswer(this.answer);
    }
  }

  getReference() {
    return this.quizService.getQuestionReference();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.questionSub.unsubscribe();
    this.optionsSub.unsubscribe();
    this.timerSub.unsubscribe();
  }
}
