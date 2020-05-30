import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { UserService } from '../../../shared/services/user/user.service';
@Injectable({
  providedIn: 'root'
})
export class QuizService {
  // This private object for each individual will be sent out  on each request.
  private userInfo = {
    id: this.userService.getUserId(),
    role: this.userService.getUserRole(),
    grp: '',
    gameId:  ''
  };

  private isGameOn: Boolean =false; // This flag is used  to ensure that the admin console and user butttons are enabled only if the game is successfully created/ if the user is valid,i.e, not been disqualiified.

  activateButtons () {
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
  
  /**
   * Trigger whenever a new player joins. Is not fired for the  admin.
   *
   * @memberof QuizService
   */
  public userConnected() {
    let msgObj = Object.assign(this.userInfo)
    this.socket.emit('userConnected', msgObj);
  }

  /**
   * Trigger whenever an admin joing/starts a game in a room. Fires only for admins
   *
   * @memberof QuizService
   */
  public startGame() {
    this.socket.emit('startRound', this.userInfo);
  }

  public setGameId(id) {
    if(id)
      this.userInfo.gameId = id;
  }

  /**
   * This contains the list of all the received messages from the server. The data will be sent out accordingly.
   *
   * @private
   * @memberof QuizService
   */
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
