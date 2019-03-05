import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class TabataCounterService {
  private _step: string;
  private audioSrc = {
    one: 'https://doc-10-4g-docs.googleusercontent.com/docs/securesc/d2posc6ncbt4i637n88j0ret606hrcsr/o7d3sormvgv2u5440t0l8uq9egsss9qa/1551758400000/05586235752672778626/05586235752672778626/0B-M-CgBHogNpRHpQZzA0SlIyaWs?e=download',
    two: 'https://doc-10-4g-docs.googleusercontent.com/docs/securesc/d2posc6ncbt4i637n88j0ret606hrcsr/pb429rj91tv5rb56cfo4b2po9tn8i8r1/1551758400000/05586235752672778626/05586235752672778626/0B-M-CgBHogNpd3Awdm56dl9TVTQ?e=download',
    three: 'https://doc-04-4g-docs.googleusercontent.com/docs/securesc/d2posc6ncbt4i637n88j0ret606hrcsr/usp1hhq5vce4qcd22654c1cs6hova04e/1551758400000/05586235752672778626/05586235752672778626/0B-M-CgBHogNpY2p1djgzZ285b1k?e=download',
    go: 'https://doc-0g-4g-docs.googleusercontent.com/docs/securesc/d2posc6ncbt4i637n88j0ret606hrcsr/daptqu3dctm2ahjdd4c4mu8gq0m6dbqu/1551758400000/05586235752672778626/05586235752672778626/0B-M-CgBHogNpQWxmM0lUN3JXeTg?e=download',
    rest: 'https://doc-04-4g-docs.googleusercontent.com/docs/securesc/d2posc6ncbt4i637n88j0ret606hrcsr/f2fkrlpgekjqgns7lvv2r92qeo56upt1/1551765600000/05586235752672778626/05586235752672778626/0B-M-CgBHogNpQTJ1UnBlMEMtWlk?e=download',
    finish: 'https://doc-14-4g-docs.googleusercontent.com/docs/securesc/d2posc6ncbt4i637n88j0ret606hrcsr/iiurt9i9nqndtr3p77h57mu5dfali69s/1551758400000/05586235752672778626/05586235752672778626/0B-M-CgBHogNpU2hzbnV3TktrUXc?e=download',
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
