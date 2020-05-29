import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { AddQuestionsComponent } from './components/add-questions/add-questions.component';


const routes: Routes = [
  {
    path:'',
    component: LandingComponent
  },
  {
    path: 'add',
    component: AddQuestionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionBankRoutingModule { }
