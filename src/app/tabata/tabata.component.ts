import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, timer, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { DialogComponent } from '../shared/component/index';

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
    private dialog: MatDialog
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
    this.openDialog();
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

  private openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.resetSetting();
      } else {
        const timeInput = this.isPause && this.countdownNumber !== 0 ?
          this.countdownNumber :
          this.tabataData[this.step + 'Time'].time.value;
        this.timeSubscribe(0, timeInput);
        this.isPause = false;
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
}
