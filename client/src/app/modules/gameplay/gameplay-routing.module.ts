import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserScreenComponent } from './components/user-screen/user-screen.component';
import { AdminScreenComponent } from './components/admin-screen/admin-screen.component';


const routes: Routes = [
  {
    path: 'play/:grpId/game/:gameId',
    component: UserScreenComponent
  },
  {
    path: 'admin/:grpId',
    component: AdminScreenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameplayRoutingModule { }
