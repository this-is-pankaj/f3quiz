import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz/quiz.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-screen',
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.scss']
})
export class AdminScreenComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService
  ) { 
    route.params
      .subscribe( params => quizService.setGrpId(params.grpId));
  }

  ngOnInit() {
    this.initialize();
  }

  initialize(){
    this.quizService.startGame();
  }

}
