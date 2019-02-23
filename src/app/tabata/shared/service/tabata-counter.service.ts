import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TabataCounterService {
  private _step: string;

  constructor() { }

  get step(): string {
    return this._step;
  }

  set step(step: string) {
    this._step = step;
  }

  runReadyTime() {
    this.step = 'ready';
  }

  runActionTime() {
    this.step = 'action';
  }

  runRestTime() {
    this.step = 'rest';
  }

  counter(time: number) {

  }
}
