import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss']
})
export class TimeInputComponent implements OnInit {
  @Input() title: string;
  @Input() value: number;
  @Input() name: string;

  constructor() { }

  ngOnInit() {
  }

}
