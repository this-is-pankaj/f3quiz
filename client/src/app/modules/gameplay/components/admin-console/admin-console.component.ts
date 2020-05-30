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
      alert('The Question is')
    }
  }

  showOptions () {
    if(this.quizService.activateButtons()){
      alert('Options are')
    }
  }

  startTimer () {
    if(this.quizService.activateButtons()){
      alert('Your time  starts  now')
    }
  }

  showAnswer() {
    if(this.quizService.activateButtons()){
      alert('The correct answer is')
    }
  }

  showResult() {
    if(this.quizService.activateButtons()){
      alert('These  people gave the right answers')
    }
  }

  endGame() {
    if(this.quizService.activateButtons()){
      alert('Thank you  for playing. Till we meet again.')
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
      text: "end game",
      click: this.endGame.bind(this)
    }
  ];
}
