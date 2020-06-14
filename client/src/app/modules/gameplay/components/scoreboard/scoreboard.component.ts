import { Component, OnInit, Input } from '@angular/core';
import { QuizService } from '../../services/quiz/quiz.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit {
  @Input('admin')isAdminConsole: Boolean  = false;
  scoreBoard = [];
  scoreBoardSub: Subscription;

  constructor(
    private quizService: QuizService
  ) { 
    this.scoreBoardSub = quizService.getScoreBoard()
      .subscribe((data)=>{
        if(data && data.length)
          this.scoreBoard = data;
        else
          this.scoreBoard = [];
      })
  }

  ngOnInit() {
  }

  shouldDisplay() {
    return this.scoreBoard.length && this.quizService.shouldShowScoreBoardPopup();
  }

  closePopup(){
    this.quizService.changePopUpState(false, 'scoreBoard');
  }
}
