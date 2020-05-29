import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionBankRoutingModule } from './question-bank-routing.module';
import { AddQuestionsComponent } from './components/add-questions/add-questions.component';
import { LandingComponent } from './components/landing/landing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [AddQuestionsComponent, LandingComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuestionBankRoutingModule,
    SharedModule
  ]
})
export class QuestionBankModule { }
