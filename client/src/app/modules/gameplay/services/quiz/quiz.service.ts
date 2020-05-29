import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { UserService } from '../../../shared/services/user/user.service';
@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private userInfo = {
    id: this.userService.getUserId(),
    role: this.userService.getUserRole(),
    grp: '',
    gameId:  ''
  };
  isGameOn: Boolean =false;

  activateButttons () {
    return this.isGameOn;
  }

  constructor(
    private userService: UserService,
    private socket: Socket
  ) { 
    this.recepients();
  }

  public setGrpId(id) {
    this.userInfo.grp = id;
  }
  
  public userConnected() {
    let msgObj = Object.assign(this.userInfo)
    this.socket.emit('userConnected', msgObj);
  }

  public startGame() {
    this.socket.emit('startRound', this.userInfo);
  }

  public setGameId(id) {
    if(id)
      this.userInfo.gameId = id;
  }

  private recepients () {
    this.socket.on('gameCreated', (msg)=>{
      console.log(msg);
      this.isGameOn = msg.success;
      this.setGameId(msg.gameId);
    });

    this.socket.on('Connected', (msg)=>{
      console.log(msg);
      alert(1);
    })
  }
}
