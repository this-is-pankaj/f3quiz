import { Component, OnInit, Input } from '@angular/core';
import { GroupsService } from '../../services/groups/groups.service';

@Component({
  selector: 'app-dashboard-options',
  templateUrl: './dashboard-options.component.html',
  styleUrls: ['./dashboard-options.component.scss']
})
export class DashboardOptionsComponent implements OnInit {
  @Input('admin') isAdmin: Boolean;
  rooms = [];
  constructor(
    private groupService: GroupsService
  ) { }

  ngOnInit() {
    this.groupService.getAllActiveGames()
      .subscribe((res)=>{
        console.log(res);
        if(res['status']  === 200){
          this.rooms = res['data'];
        }
      })
  }

  joinGame(game) {
    console.log(game);
  }
}
