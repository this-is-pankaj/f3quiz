import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  {
    path: 'auth',
    loadChildren: ()=> import('./modules/authenticate/authenticate.module').then(m=>m.AuthenticateModule)
  },
  {
    path: 'app',
    loadChildren: ()=> import('./modules/dashboard/dashboard.module').then(m=>m.DashboardModule),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  {
    path: 'questions',
    loadChildren: ()=>  import('./modules/question-bank/question-bank.module').then(m=>m.QuestionBankModule),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  {
    path: 'quiz',
    loadChildren: ()=> import('./modules/gameplay/gameplay.module').then(m=>m.GameplayModule),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
  {
    path: "**",
    pathMatch: "full",
    redirectTo: "auth"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
