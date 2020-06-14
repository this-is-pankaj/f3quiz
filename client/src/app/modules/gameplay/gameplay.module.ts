import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameplayRoutingModule } from './gameplay-routing.module';
import { QuizComponent } from './components/quiz/quiz.component';
import { QuizService } from './services/quiz/quiz.service';
import { UserScreenComponent } from './components/user-screen/user-screen.component';
import { AdminScreenComponent } from './components/admin-screen/admin-screen.component';
import { AdminConsoleComponent } from './components/admin-console/admin-console.component';
import { SharedModule } from '../shared/shared.module';
import { ResultsComponent } from './components/results/results.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';

@NgModule({
  declarations: [QuizComponent, UserScreenComponent, AdminScreenComponent, AdminConsoleComponent, ResultsComponent, ScoreboardComponent],
  providers: [
    QuizService
  ],
  imports: [
    CommonModule,
    GameplayRoutingModule,
    SharedModule
  ]
})
export class GameplayModule { }
