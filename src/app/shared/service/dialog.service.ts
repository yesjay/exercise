import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DialogComponent } from '../component/index';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private dialog: MatDialog,
  ) { }

  openDialog(dialogType: string, dialogWidth = '250px'): MatDialogRef<DialogComponent, any> {
    return this.dialog.open(DialogComponent, {
      width: dialogWidth,
      data: {
        type: dialogType
      }
    });
  }
}

