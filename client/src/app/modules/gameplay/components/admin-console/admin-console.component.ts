import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz/quiz.service';
import * as RecordRTC from 'recordrtc';

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.scss']
})
export class AdminConsoleComponent implements OnInit {

  constructor(private quizService: QuizService) { }

  ngOnInit() {
    
  }
  private isSpeaking: Boolean = false;
  private streamAudio(stream) {
    const StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    // const bufferSize = 16384;
    // let audioContext = new AudioContext(),
    //   gainNode = audioContext.createGain();
      
    // gainNode.connect(audioContext.destination);

    // let micStream = audioContext.createMediaStreamSource(stream);
    // micStream.connect(gainNode);

    // let scriptProcessorNode = audioContext.createScriptProcessor(bufferSize, 1, 1);
    // scriptProcessorNode.onaudioprocess = this.onAudioProcess;
    let audioRecorder = RecordRTC(stream, {
      type: 'audio',
      mimeType: 'audio/webm',
      sampleRate: 44100,
      // used by StereoAudioRecorder
      // the range 22050 to 96000.
      // let us force 16khz recording:
      desiredSampRate: 16000,
   
      // MediaStreamRecorder, StereoAudioRecorder, WebAssemblyRecorder
      // CanvasRecorder, GifRecorder, WhammyRecorder
      recorderType: StereoAudioRecorder,
      // Dialogflow / STT requires mono audio
      numberOfAudioChannels: 1,
      timeSlice: 500,
      ondataavailable: this.quizService.setAudio()
    });
    if(this.isSpeaking)
      audioRecorder.startRecording();
    else
      audioRecorder.stopRecording();
  }

  speak() {
    let that = this;
    that.isSpeaking = !that.isSpeaking;
    if (navigator.getUserMedia){
      navigator.getUserMedia({
        audio:{ 
        echoCancellation:true
        }
      }, 
        function(stream) {
          that.streamAudio(stream);
        },
        function(e) {
          alert('Error capturing audio.');
        }
      );

    } 
    else { 
      alert(`getUserMedia not supported in this browser. You can't speak`); 
    }
  }

  showQuestion() {
    if(this.quizService.activateButtons()){
      this.quizService.getNextQuestion();
    }
  }

  showOptions () {
    if(this.quizService.activateButtons()){
      this.quizService.getOptions();
    }
  }

  showAnswer() {
    if(this.quizService.activateButtons()){
      this.quizService.showAnswer();
    }
  }
  
  showResult() {
    if(this.quizService.activateButtons()){
      this.quizService.showRoundWinner();
    }
  }

  showScores() {
    if(this.quizService.activateButtons()) {
      this.quizService.showScoreBoard();
    }
  }

  endGame() {
    if(this.quizService.activateButtons()){
      this.quizService.closeGame();
    }
  }

  consoleButtons = [
    {
      text: "speak",
      click: this.speak.bind(this)
    },
    {
      text: "show question",
      click: this.showQuestion.bind(this)
    },
    {
      text: "show options",
      click: this.showOptions.bind(this)
    },
    {
      text: "show answer",
      click: this.showAnswer.bind(this)
    },
    {
      text: "show result",
      click: this.showResult.bind(this)
    },
    {
      text: "Show Scoreboard",
      click: this.showScores.bind(this)
    },
    {
      text: "end game",
      click: this.endGame.bind(this)
    }
  ];
}
