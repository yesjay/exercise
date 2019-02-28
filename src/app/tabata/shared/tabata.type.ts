import { FormControl } from '@angular/forms';

export interface TimeInput {
    icon?: string;
    title: string;
    name: string;
    time: FormControl;
}

export interface TabataTimeInputs {
    readyTime: TimeInput;
    actionTime: TimeInput;
    restTime: TimeInput;
    loopTime: TimeInput;
    groupTime: TimeInput;
}
