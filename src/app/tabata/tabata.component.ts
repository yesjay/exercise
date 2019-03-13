import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable, timer, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { TabataCounterService } from './shared/service/tabata-counter.service';
import { DialogService, GoogleCalendarService } from '../shared/service';

import { TabataTimeInputs } from './shared/tabata.type';

@Component({
  selector: 'app-tabata',
  templateUrl: './tabata.component.html',
  styleUrls: ['./tabata.component.scss']
})
export class TabataComponent implements OnInit {
  isMobile: boolean;
  isPause: boolean;
  nowLoopTime: number;
  nowGroupTime: number;
  countdownNumber: number;
  progressBar: number;
  status: string;
  step: string;
  tabataList: Array<string>;
  tabataData: TabataTimeInputs;
  timeSubscriber: Subscription;
  toggleButton = 'readyTime';

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialogService: DialogService,
    private tabata: TabataCounterService,
    private googleCalendarService: GoogleCalendarService,
  ) { }

  ngOnInit() {
    this.resetSetting();
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
        time: new FormControl(
          {value: 10, disabled: false},
          [Validators.required, Validators.pattern('[0-9]*')]
        ),
      },
      actionTime: {
        icon: 'directions_run',
        title: '運動(秒)',
        name: 'actionTime',
        time: new FormControl(
          {value: 20, disabled: false},
          [Validators.required, Validators.pattern('[0-9]*')]
        )
      },
      restTime: {
        icon: 'hotel',
        title: '休息(秒)',
        name: 'restTime',
        time: new FormControl(
          {value: 10, disabled: false},
          [Validators.required, Validators.pattern('[0-9]*')]
        )
      },
      loopTime: {
        icon: 'loop',
        title: '循環',
        name: 'loopTime',
        time: new FormControl(
          {value: 8, disabled: false},
          [Validators.required, Validators.pattern('[0-9]*')]
        )
      },
      groupTime: {
        icon: 'group_work',
        title: '組數',
        name: 'groupTime',
        time: new FormControl(
          {value: 1, disabled: false},
          [Validators.required, Validators.pattern('[0-9]*')]
        )
      },
    };
    this.tabataList = Object.keys(this.tabataData);
    this.tabata.loadAllAudio();
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
    this.runPause();
    this.openDialog('cancel');
  }

  timeInputDisabled(): void {
    this.tabataList.forEach((time: string) => {
      this.tabataData[time].time.disable();
    });
  }

  timeInputEnabled(): void {
    this.tabataList.forEach((time: string) => {
      this.tabataData[time].time.enable();
    });
  }

  private openDialog(dialogType: string): void {
    const dialogRef = this.dialogService.openDialog(dialogType);

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result === 'restart') {
        this.resetSetting();
        this.timeInputEnabled();
      } else if (result === 'no-restart') {
        const timeInput = this.isPause && this.countdownNumber !== 0 ?
          this.countdownNumber :
          this.tabataData[this.step + 'Time'].time.value;
        this.timeSubscribe(0, timeInput);
        this.isPause = false;
      } else if (result === 'insert') {
        this.googleCalendarService.addEvent(this.getStartDate());
        window.open('https://www.google.com/calendar?tab=uc');
      }
    });
  }

  private controlCountDown(status: string): void {
    if (status === 'run') {
      this.runCountDown();
    } else if (status === 'pause') {
      this.runPause();
    }
  }

  private runCountDown(): void {
    const timeInput = this.isPause && this.countdownNumber !== 0 ? this.countdownNumber : this.tabataData[this.step + 'Time'].time.value;
    this.timeSubscribe(0, timeInput);
    this.isPause = this.isPause ? false : this.isPause;
  }

  private runPause(): void {
    this.isPause = true;
    if (this.timeSubscriber) {
      this.timeSubscriber.unsubscribe();
    }
  }

  private timeSubscribe(delayTime: number, time: number): void {
    this.timeSubscriber = this.countDown(delayTime, time).subscribe((nowTime: number) => {
      this.countdownNumber = nowTime;
      this.progressBar = this.getProgressValue(nowTime);
      this.checkTimeout();
      this.controlBeep(this.countdownNumber);
    });
  }

  private countDown(delayTime: number, time: number): Observable<number> {
    const frequency = 1000;
    return timer(delayTime, frequency).pipe(
      map((eachTime: number) => time - eachTime),
      take(time + 1)
    );
  }

  private getProgressValue(nowTime: number): number {
    const actionTime = this.tabataData.actionTime.time.value;
    return this.step === 'action' ?
      Math.floor(((actionTime - nowTime) / actionTime) * 100) :
      100;
  }

  private controlBeep(time: number) {
    const audio = new Audio();
    if (this.step === 'action') {
      if (time === 0) {
        this.tabata.playGoAudio();
      }
    } else if (this.step === 'rest' || this.step === 'ready') {
      if (time === 3) {
        this.tabata.playThreeAudio();
      } else if (time === 2) {
        this.tabata.playTwoAudio();
      } else if (time === 1) {
        this.tabata.playOneAudio();
      } else if (time === 0 && this.nowGroupTime !== this.tabataData.groupTime.time.value) {
        this.tabata.playRestAudio();
      }
    } else if (this.step === 'end') {
      if (time === 0) {
        this.tabata.playFinishAudio();
        this.openDialog('finish');
      }
    }
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
      this.nowGroupTime = parseInt(this.tabataData.loopTime.time.value, 10) === this.nowLoopTime ?
      this.nowGroupTime + 1 : this.nowGroupTime;
    }
  }

  private runNextStep(): void {
    if (this.nowGroupTime === this.tabataData.groupTime.time.value) {
      this.status = 'finish';
      this.step = 'end';
    } else {
      this.step = this.step === 'action' ? 'rest' : 'action';
      const timeInput = this.isPause ? this.countdownNumber : this.tabataData[this.step + 'Time'].time.value,
            delayTime = 1000;
      this.timeSubscribe(delayTime, timeInput);
    }
  }

  private resetSetting() {
    this.status = 'origin';
    this.step = 'ready';
    this.nowGroupTime = 0;
    this.nowLoopTime = 0;
    this.countdownNumber = 0;
    this.isPause = false;
    this.progressBar = 100;
  }

  private getStartDate(): Date {
    const toDayMilliseconds = new Date().valueOf();
    return new Date(toDayMilliseconds - this.getGroupMilliseconds());
  }

  private getGroupMilliseconds(): number {
    const restTime = this.tabataData.restTime.time.value,
          actionTime = this.tabataData.actionTime.time.value,
          readyTime = this.tabataData.readyTime.time.value,
          loopTime = this.tabataData.loopTime.time.value,
          groupTime = this.tabataData.groupTime.time.value;
    return ((restTime * (loopTime - 1)) + (actionTime * loopTime) + readyTime) * groupTime * 1000;
  }
}
