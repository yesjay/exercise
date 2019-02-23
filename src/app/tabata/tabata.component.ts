import { Component, OnInit } from '@angular/core';
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
  tabataList: Array<string>;
  nowLoopTime = 0;
  nowGroupTime = 0;
  reciprocalTime = 0;
  status = 'orign';
  isMobile: boolean;
  isPause: boolean;
  step = 'ready';
  opener = false;
  meter;
  countdownNumber = 0;
  timeSubscriber: any;

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
        title: '組數(輪)',
        name: 'groupTime',
        time: 1,
      },
    };
    this.tabataList = Object.keys(this.tabataData);
  }

  control(status) {
    this.status = status;
    this.transeStatus(status);
  }

  cancel() {
    this.status = 'orign';
    this.step = 'ready';
    this.nowGroupTime = 0;
    this.nowLoopTime = 0;
    this.countdownNumber = 0;
    this.timeSubscriber.unsubscribe();
  }

  private transeStatus(status: string) {
    if (status === 'run') {
      this.runCountDown();
    } else if (status === 'pause') {
      this.runPause();
    }
  }

  private runCountDown(): void {
    if (this.isPause) {
      this.timeSubscriber = this.countDown(this.countdownNumber).subscribe((nowTime: number) => {
        this.countdownNumber = nowTime;
        this.checkTimeout();
      });
      this.isPause = false;
    } else {
      this.timeSubscriber = this.countDown().subscribe((nowTime: number) => {
        this.countdownNumber = nowTime;
        this.checkTimeout();
      });
    }
  }

  private countDown(time?: number): Observable<number> {
    const startTime = time ? time : this.getStepTime(),
          frequency = 100;
    return timer(0, frequency).pipe(
      map((eachTime: number) => startTime - eachTime),
      take(startTime + 1)
    );
  }

  private checkTimeout() {
    if (this.countdownNumber === 0) {
      this.timeSubscriber.unsubscribe();
      this.countStepTime();
      this.transStep();
      this.runNextStep();
    }
  }

  private countStepTime() {
    if (this.step === 'action') {
      this.nowLoopTime += 1;
      this.nowGroupTime = this.tabataData.loopTime.time === this.nowLoopTime ?
      this.nowGroupTime + 1 : this.nowGroupTime;
    }
  }

  private runNextStep() {
    if (this.nowGroupTime !== this.tabataData.groupTime.time) {
      this.timeSubscriber = this.countDown().pipe(
        delay(1000),
      ).subscribe((nowTime: number) => {
        this.countdownNumber = nowTime;
        this.checkTimeout();
      });
    }
  }

  private transStep() {
    this.step = this.step === 'action' ? 'rest' : 'action';
  }

  private runPause(): void {
    this.isPause = true;
    this.timeSubscriber.unsubscribe();
  }

  private getStepTime(): number {
    let time;
    if (this.step === 'ready') {
      time = this.tabataData.readyTime.time;
    } else if (this.step === 'action') {
      time = this.tabataData.actionTime.time;
    } else if (this.step === 'rest') {
      time = this.tabataData.restTime.time;
    }
    return time;
  }
}
