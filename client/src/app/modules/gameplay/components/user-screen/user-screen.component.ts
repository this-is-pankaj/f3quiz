import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz/quiz.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-screen',
  templateUrl: './user-screen.component.html',
  styleUrls: ['./user-screen.component.scss']
})
export class UserScreenComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService
  ) { 
    route.params
      .subscribe((params) => {
        quizService.setGrpId(params.grpId);
        quizService.setGameId(params.gameId);
      });
  }

  ngOnInit() {
    this.initialize();
  }

  initialize(){
    this.quizService.userConnected();
  }

}
