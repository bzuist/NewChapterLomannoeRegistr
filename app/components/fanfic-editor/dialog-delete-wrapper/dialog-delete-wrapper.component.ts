import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { Fanfic } from 'src/app/models/fanfics';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-dialog-edit-wrapper',
  templateUrl: './dialog-delete-wrapper.component.html',
  styleUrls: ['./dialog-delete-wrapper.component.css']
})
export class DialogDeleteWrapperComponent implements OnInit {

  deleteFanfic: Fanfic;

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteWrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.deleteFanfic = new Fanfic(this.data, new Map<number, string>());
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onDeleteClick(): void {
    this.dialogRef.close(true);
  }
}
