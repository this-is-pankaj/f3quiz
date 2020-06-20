import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { UserService } from '../../../shared/services/user/user.service';
import { Subject, Observable } from 'rxjs';
import { Question } from '../../interfaces/question';
import { Timer } from '../../interfaces/timer';
import { Router } from '@angular/router';
import { AppStatic } from '../../../../_helper/appStatic.constant';
// import * as ss from 'socket.io-stream';

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

  // private stream = ss.createStream();
  private appStatic = AppStatic;
  private points = new Subject<Number>();

  private question = new Subject<Question>();

  private options = new Subject();

  private timer = new Subject<Timer>();

  private roundResult = new Subject();

  private scoreBoard = new Subject();

  private isGameOn: Boolean =false; // This flag is used  to ensure that the admin console and user butttons are enabled only if the game is successfully created/ if the user is valid,i.e, not been disqualiified.

  private showResultPopUp: Boolean = false;

  private showScoreBoardPopUp: Boolean = false;

  private submitBtnActive:  Boolean = false;

  private showFastest: Boolean = false;

  private soundBuffer = new Subject();

  private setPoints(points) {
    this.points.next(points);
  }

  public getPoints() {
    return this.points.asObservable();
  }

  activateButtons () {
    return this.isGameOn;
  }

  public isSubmitButtonActive() {
    return this.submitBtnActive;
  }

  private setSubmitBtnState(state) {
    this.submitBtnActive = state;
  }

  public getQuestion():Observable<any> {
    return this.question.asObservable();
  }

  private setQuestion(ques) {
    if(ques.text)
      this.question.next(ques);
  }

  public getOptionsToBeDisplayed(): Observable<any>{
    return this.options.asObservable();
  }

  private setOptions(options) {
    if(options){
      this.options.next(options);
    }
  }

  public getTimer() {
    return this.timer.asObservable();
  }

  private setTimer(val){
    if(val>-1){
      this.timer.next({text:val});
    }

    if(!val) {
      this.setSubmitBtnState(false);
    }
  }

  public getVoice() {
    return  this.soundBuffer.asObservable();
  }

  private updateSoundBuffer(buffer) {
    this.soundBuffer.next(buffer);
  }

  public getRoundResult():Observable<any> {
    return this.roundResult.asObservable();
  }

  public getScoreBoard():Observable<any> {
    return this.scoreBoard.asObservable();
  }

  private setRoundResult(res) {
    this.roundResult.next(res);
  }

  private setScoreBoard(res) {
    this.scoreBoard.next(res);
  }

  public shouldShowResultPopup() {
    return this.showResultPopUp;
  }

  public shouldShowScoreBoardPopup() {
    return this.showScoreBoardPopUp;
  }

  private setResultPopUpState(state) {
    this.showResultPopUp  = state;
  }

  private setScoreBoardPopUpState(state) {
    this.showScoreBoardPopUp = state;
  }

  private setShowFastestFlag(flag) {
    if(flag) {
      // If the fastestt is being shown, that means, we need to save the points  for the user as well.
      this.socket.emit('addPointsForRoundWinner', this.userInfo);
    }
    this.showFastest = flag;
  }

  public shouldShowWinner() {
    return this.showFastest;
  }

  constructor(
    private userService: UserService,
    private socket: Socket,
    private router: Router
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

  public closeGame() {
    this.socket.emit('endRound', this.userInfo);
  }

  public setGameId(id) {
    if(id)
      this.userInfo.gameId = id;
  }

  public getNextQuestion() {
    this.socket.emit('getNextQues', this.userInfo);
  }

  public getOptions() {
    this.socket.emit('getOptions',  this.userInfo);
  }

  public showAnswer() {
    this.socket.emit('getAnswer', this.userInfo);
  }

  public showRoundWinner() {
    this.socket.emit('getWinner', this.userInfo);
  }

  public getFastestUser() {
    this.socket.emit('getFastestAnswer', this.userInfo);
  }

  public showScoreBoard() {
    this.socket.emit('getScores', this.userInfo);
  }

  public submitAnswer(answer) {
    this.setSubmitBtnState(false);
    this.socket.emit('submitAnswer',  {info: this.userInfo, myAnswer: answer});
  }

  public changePopUpState(state, popupType) {
    if(popupType === 'results')
      this.socket.emit('changeResultPopUpState', {info: this.userInfo, state});
    else if(popupType === 'scoreBoard')
      this.socket.emit('changeScoreBoardPopUpState', {info: this.userInfo, state});
  }

  public setAudio() {
    let socket = this.socket,
      info = this.userInfo;

    return function(audio){
      socket.emit('streamAudio', {
        name: 'stream.wav',
        size: audio.size,
        blob: audio,
        info
      });
    }
    // making use of socket.io-stream for bi-directional
    // streaming, create a stream
    // ss(this.socket).emit('streamAudio', this.stream, {
    //     name: 'stream.wav',
    //     size: audio.size,
    //     info: this.userInfo
    // });
    
    // pipe the audio blob to the read stream
    // ss.createBlobReadStream(audio).pipe(this.stream);
    // this.socket.emit('streamAudio', {audio, info: this.userInfo});
  }

  /**
   * This contains the list of all the received messages from the server. The data will be sent out accordingly.
   *
   * @private
   * @memberof QuizService
   */
  private recepients () {
    this.socket.on('gameCreated', (msg)=>{
      this.isGameOn = msg.success;
      this.setGameId(msg.gameId);
    });

    this.socket.on('Connected', (msg)=>{
      if(!msg.success){
        alert(msg.message);
        this.router.navigate([this.appStatic.defaultRoutes[this.userInfo.role].dashboard]);
      }
    });

    this.socket.on('question', (msg)=>{
      if(msg.success) {
        //Set the question to the new one received.
        this.setQuestion(msg.ques);
        this.setOptions([]);
        this.setSubmitBtnState(false);  //  Disable the button on new  question  arrival
      }
      else{
        console.log(`Unable to get questions`);
      }
    });

    this.socket.on('options', (msg)=>{
      if(msg.success) {
        //Set the options to the new one received.
        this.setOptions(msg.options);
        this.setTimer(msg.timer);
        this.setSubmitBtnState(true);
      }
      else{
        console.log(`Unable to get options`);
      }
    });

    this.socket.on('setTimer', (msg)=>{
      if(msg.success) {
        //Set the question to the new one received.
        this.setTimer(msg.timer);
      }
      else{
        console.log(`Unable to set Timer`);
      }
    });

    this.socket.on('submittedAnswer', (msg)=>{
      // Set the submitBtnState to active, in case submission failed
      this.setSubmitBtnState(!msg.success);
    });

    this.socket.on('displayAnswer', (msg)=>{
      this.setOptions(msg.correctAns.answer);
    });

    this.socket.on('displayRoundResult', (msg)=>{
      if(msg.success) {
        this.setRoundResult(msg.result);
        this.setShowFastestFlag(false);
        this.setResultPopUpState(true);
      }
    });

    this.socket.on('displayResultPopup', (msg)=>{
      this.setShowFastestFlag(false); // Set it  to false when closing the popup
      this.setResultPopUpState(msg);
    });

    this.socket.on('displayScoreBoardPopup', (msg)=>{
      this.setScoreBoardPopUpState(msg);
    });

    this.socket.on('showFastest', (msg)=>{
      this.setShowFastestFlag(true);
    });

    this.socket.on('updatePoints', (msg)=>{ 
      console.log(msg);
      this.setPoints(msg.points);
    });

    this.socket.on('showScoreBoard', (msg)=>{
      console.log(msg);
      this.setScoreBoard(msg.participants);
      this.setScoreBoardPopUpState(true);
    });

    let audioCtx = new AudioContext();
    this.socket.on('adminSpeaks', (audio)=>{
      // let audioBlob = new Blob([audio.audio], { type: "audio/wav" });
      let audioBuffer = audio.audio;
      audioCtx.decodeAudioData(audioBuffer, (buffered)=>{
        let source = audioCtx.createBufferSource(); // creates a sound source
        source.buffer = buffered;                    // tell the source which sound to play
        source.connect(audioCtx.destination);       // connect the source to the context's destination (the speakers)
        source.start(0); 
      })
      // let audioElm = new Audio();
      // audioElm.src = window.URL.createObjectURL(audioBlob);
      // audioElm.play();
    })

    this.socket.on('gameOver', (msg)=>{
      console.log(msg);
      if(msg.success) {
        alert('Gaame Over.. Closing Room!');
        // navigate the user to the dashboard.
        this.router.navigate([this.appStatic.defaultRoutes[this.userInfo.role].dashboard]);
      }
    });

    this.socket.on('disconnect', ()=>{
      alert('You are disconnected.. refresh to continue!');
      window.location.reload();
      // $(".support").removeClass("hide");
    });
  }
}
