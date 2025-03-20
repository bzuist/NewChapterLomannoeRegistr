import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { Fanfic } from 'src/app/models/fanfics';

@Component({
  selector: 'app-dialog-change-wrapper',
  templateUrl: './dialog-change-wrapper.component.html',
  styleUrls: ['./dialog-change-wrapper.component.css']
})
export class DialogChangeWrapperComponent implements OnInit {

  changeFanfic: Fanfic;

  constructor(public dialogRef: MatDialogRef<DialogChangeWrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.changeFanfic = data;
    }

    ngOnInit() {

    }

    onNoClick(): void {
      this.dialogRef.close();
    }
  }
