import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-screen',
  templateUrl: './user-screen.component.html',
  styleUrls: ['./user-screen.component.scss']
})
export class UserScreenComponent implements OnInit {
  pointSub: Subscription;
  points:Number = 0;
  speakerSub: Subscription;
  speaker = new AudioContext();

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService
  ) { 
    route.params
      .subscribe((params) => {
        quizService.setGrpId(params.grpId);
        quizService.setGameId(params.gameId);
      });

    this.pointSub = quizService.getPoints()
      .subscribe((p)=>{
        this.points = p;
      });

    this.speakerSub = quizService.getVoice()
      .subscribe((audio)=>{
        console.log(audio);
        // this.speaker.createBuffer(audio);
      })
  }

  ngOnInit() {
    this.initialize();
  }

  initialize(){
    this.quizService.userConnected();
  }

  getPoints() {
    return this.quizService.getPoints();
  }

  playSound() {
    let context = new AudioContext();
    this.quizService.getVoice();
  }
}
