import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services/groups/groups.service';
import { Observable } from 'rxjs';
import { Group } from '../../interfaces/group';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.scss']
})
export class MyGroupsComponent implements OnInit {
  groupsList$: [Group];
  constructor(
    private groupService:  GroupsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    let that = this;
    that.groupService.fetchGroups()
      .subscribe((groups)=>{
        if(groups['status']  === 200){
          that.groupsList$  = groups['data'];
        }
      })
  }

  startGame(grp) {
    const id = grp['_id'];
    this.groupService.startGame(id);
  }
}
