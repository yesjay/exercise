import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class TabataCounterService {
  private _step: string;
  private _status: string;
  private _nowGroupTime: number;
  private _nowLoopTime: number;
  private _countdownNumber: number;
  private _isPause: boolean;
  private _progressBar: number;
  private audioSrc = {
    finish: '../../assets/audio/FINISH.mp3',
    one: '../../assets/audio/short1.mp3',
    two: '../../assets/audio/short2.mp3',
    three: '../../assets/audio/short3.mp3',
    go: '../../assets/audio/shortgo.mp3',
    rest: '../../assets/audio/shortrest.mp3',
  };
  private audio = {
    one: new Audio(this.audioSrc.one),
    two: new Audio(this.audioSrc.two),
    three: new Audio(this.audioSrc.three),
    go: new Audio(this.audioSrc.go),
    rest: new Audio(this.audioSrc.rest),
    finish: new Audio(this.audioSrc.finish),
  };

  constructor() { }

  get step(): string {
    return this._step;
  }

  set step(step: string) {
    this._step = step;
  }

  loadAllAudio() {
    Object.keys(this.audio).forEach((audioName: string) => {
      this.audio[audioName].load();
    });
  }

  loadAudio(audioName: string) {
    this.audio[audioName].load();
  }

  getAudio(audioName: string): string {
    return this.audio[audioName];
  }

  playOneAudio() {
    this.playAudio('one');
  }

  playTwoAudio() {
    this.playAudio('two');
  }

  playThreeAudio() {
    this.playAudio('three');
  }

  playGoAudio() {
    this.playAudio('go');
  }

  playRestAudio() {
    this.playAudio('rest');
  }

  playFinishAudio() {
    this.playAudio('finish');
  }

  private playAudio(audioName: string) {
    this.audio[audioName].play();
  }
}
