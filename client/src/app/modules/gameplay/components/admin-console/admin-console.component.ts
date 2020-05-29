import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz/quiz.service';

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.scss']
})
export class AdminConsoleComponent implements OnInit {

  constructor(private quizService: QuizService) { }

  ngOnInit() {
    
  }

  startGame() {
    if(this.quizService.isGameOn){
      alert('start')
    }
  }

  consoleButtons = [
    {
      text: "show options",
      click: this.startGame.bind(this)
    },
    {
      text: "next question",
      click: this.startGame
    },
    {
      text: "start timer",
      click: this.startGame
    },
    {
      text: "show answer",
      click: this.startGame
    },
    {
      text: "show result",
      click: this.startGame
    },
    {
      text: "end game",
      click: this.startGame
    }
  ];
}
