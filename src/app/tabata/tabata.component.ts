import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, timer } from 'rxjs';
import { map, take, delay } from 'rxjs/operators';

import { TimeInput } from './shared/tabata.type';


@Component({
  selector: 'app-tabata',
  templateUrl: './tabata.component.html',
  styleUrls: ['./tabata.component.scss']
})
export class TabataComponent implements OnInit {
  tabataData: any;
  timeSubscriber: any;
  isMobile: boolean;
  isPause: boolean;
  tabataList: Array<string>;
  nowLoopTime = 0;
  nowGroupTime = 0;
  countdownNumber = 0;
  progressBar = 100;
  status = 'origin';
  step = 'ready';
  toggleButton = 'readyTime';
  countdownText = 'Ready!';

  constructor(
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit() {
    this.breakpointObserver.observe([
      '(max-width: 550px)'
    ]).subscribe(result => {
      this.isMobile = result.matches === true ? true : false;
    });
    this.tabataData = {
      readyTime: {
        icon: 'directions_walk',
        title: '預備(秒)',
        name: 'readyTime',
        time: 10,
      },
      actionTime: {
        icon: 'directions_run',
        title: '運動(秒)',
        name: 'actionTime',
        time: 20,
      },
      restTime: {
        icon: 'hotel',
        title: '休息(秒)',
        name: 'restTime',
        time: 10,
      },
      loopTime: {
        icon: 'loop',
        title: '循環',
        name: 'loopTime',
        time: 8,
      },
      groupTime: {
        icon: 'group_work',
        title: '組數',
        name: 'groupTime',
        time: 1,
      },
    };
    this.tabataList = Object.keys(this.tabataData);
  }

  control(status: string): void {
    if (status === 'replay') {
      this.cancel();
      this.controlCountDown('run');
      this.status = 'run';
    } else {
      this.status = status;
      this.controlCountDown(status);
    }
  }

  cancel(): void {
    this.status = 'origin';
    this.step = 'ready';
    this.nowGroupTime = 0;
    this.nowLoopTime = 0;
    this.countdownNumber = 0;
    this.isPause = false;
    this.progressBar = 100;
    this.timeSubscriber.unsubscribe();
  }

  private controlCountDown(status: string): void {
    if (status === 'run') {
      this.runCountDown();
    } else if (status === 'pause') {
      this.isPause = true;
      this.timeSubscriber.unsubscribe();
    }
  }

  private runCountDown(): void {
    const timeInput = this.isPause && this.countdownNumber !== 0 ? this.countdownNumber : this.tabataData[this.step + 'Time'].time;
    this.timeSubscribe(0, timeInput);
    this.isPause = this.isPause ? false : this.isPause;
  }

  private timeSubscribe(delayTime: number, time: number): void {
    this.timeSubscriber = this.countDown(delayTime, time).subscribe((nowTime: number) => {
      this.countdownNumber = nowTime;
      this.progressBar = this.getProgressValue(nowTime);
      this.checkTimeout();
    });
  }

  private countDown(delayTime: number, time: number): Observable<number> {
    const frequency = 100;
    return timer(delayTime, frequency).pipe(
      map((eachTime: number) => time - eachTime),
      take(time + 1)
    );
  }

  private getProgressValue(nowTime: number): number {
    const actionTime = this.tabataData.actionTime.time;
    return this.step === 'action' ?
      Math.floor(((actionTime - nowTime) / actionTime) * 100) :
      100;
  }

  private checkTimeout(): void {
    if (this.countdownNumber === 0) {
      this.timeSubscriber.unsubscribe();
      this.countStepTime();
      this.runNextStep();
    }
  }

  private countStepTime(): void {
    if (this.step === 'action') {
      this.nowLoopTime += 1;
      this.nowGroupTime = parseInt(this.tabataData.loopTime.time, 10) === this.nowLoopTime ?
      this.nowGroupTime + 1 : this.nowGroupTime;
    }
  }

  private runNextStep(): void {
    if (this.nowGroupTime === this.tabataData.groupTime.time) {
      this.status = 'finish';
      this.step = 'end';
    } else {
      this.step = this.step === 'action' ? 'rest' : 'action';
      const timeInput = this.isPause ? this.countdownNumber : this.tabataData[this.step + 'Time'].time,
            delayTime = 1000;
      this.timeSubscribe(delayTime, timeInput);
    }
  }
}
