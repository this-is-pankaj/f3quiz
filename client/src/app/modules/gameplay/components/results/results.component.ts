import { Component, OnInit, Input } from '@angular/core';
import { QuizService } from '../../services/quiz/quiz.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  @Input('admin') isAdminConsole: Boolean  = false;
  roundResult = [];
  roundResultSub: Subscription;


  constructor(private quizService: QuizService) { }

  ngOnInit() {
    this.roundResultSub  = this.quizService.getRoundResult()
      .subscribe((o)=>{
        if(o && o.length)  {
          this.roundResult = o;
        }
        else{
          this.roundResult  =  [];
        }

        // console.log(this.roundResult);
      })
  }

  shouldDisplay() {
    return this.roundResult.length && this.quizService.shouldShowResultPopup();
  }

  showFastestUser() {
    this.quizService.getFastestUser();
  }

  closePopup(){
    this.quizService.changePopUpState(false, 'results');
  }
  
  isWinner(res) {
    return this.quizService.shouldShowWinner() && res.isWinner;
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.roundResultSub.unsubscribe();
  }

}
