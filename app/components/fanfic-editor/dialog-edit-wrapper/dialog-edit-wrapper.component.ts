import { Genre } from './../../../models/genre';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { Fanfic } from 'src/app/models/fanfics';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog-edit-wrapper',
  templateUrl: './dialog-edit-wrapper.component.html',
  styleUrls: ['./dialog-edit-wrapper.component.css']
})
export class DialogEditWrapperComponent implements OnInit {

  editingFanfic: Fanfic;
  fanfics: Fanfic[];
  genres: Genre[];
  genreID: number;

  constructor(public dialogRef: MatDialogRef<DialogEditWrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
      console.log(this.data.genres)
      this.editingFanfic = new Fanfic(this.data.fanfic, new Map<number, string>());
    }

    onNoClick(): void {
      this.dialogRef.close();
    }
  }
