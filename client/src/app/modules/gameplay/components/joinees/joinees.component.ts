import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz/quiz.service';

@Component({
  selector: 'app-joinees',
  templateUrl: './joinees.component.html',
  styleUrls: ['./joinees.component.scss']
})
export class JoineesComponent implements OnInit {
  display = false;
  constructor(
    private quizService: QuizService
  ) { }

  ngOnInit() {
  }

  getJoineeUpdate() {
    this.display = true;
    setTimeout(()=>{
      this.display = false;
    }, 2000);
    return this.quizService.getParticipantInfo();
  }

}
