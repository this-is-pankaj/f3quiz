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

  showQuestion() {
    if(this.quizService.activateButtons()){
      this.quizService.getNextQuestion();
    }
  }

  showOptions () {
    if(this.quizService.activateButtons()){
      this.quizService.getOptions();
    }
  }

  startTimer () {
    if(this.quizService.activateButtons()){
      this.quizService.getTimer();
    }
  }

  showAnswer() {
    if(this.quizService.activateButtons()){
      this.quizService.showAnswer();
    }
  }
  
  showResult() {
    if(this.quizService.activateButtons()){
      this.quizService.showRoundWinner();
    }
  }

  showScores() {
    if(this.quizService.activateButtons()) {
      this.quizService.showScoreBoard();
    }
  }

  endGame() {
    if(this.quizService.activateButtons()){
      this.quizService.closeGame();
    }
  }

  consoleButtons = [
    {
      text: "show question",
      click: this.showQuestion.bind(this)
    },
    {
      text: "show options",
      click: this.showOptions.bind(this)
    },
    {
      text: "start timer",
      click: this.startTimer.bind(this)
    },
    {
      text: "show answer",
      click: this.showAnswer.bind(this)
    },
    {
      text: "show result",
      click: this.showResult.bind(this)
    },
    {
      text: "Show Scoreboard",
      click: this.showScores.bind(this)
    },
    {
      text: "end game",
      click: this.endGame.bind(this)
    }
  ];
}
