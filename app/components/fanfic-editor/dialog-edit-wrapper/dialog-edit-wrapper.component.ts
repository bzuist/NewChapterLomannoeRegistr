import { Genre } from './../../../models/genre';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { Fanfic } from 'src/app/models/fanfics';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CredentialResponse } from 'src/app/models/auth/CredentialResponse';
import { User } from 'src/app/models/user';

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
      const user = this.LoggedUser;

      const userId = user.userData?.id;
      const username = user.userData?.username;

      const usersMap = new Map<number, string>();
      if (userId && username) {
        usersMap.set(Number(userId), username);
      }

      const fanficData = {
        ...this.data.fanfic,
        userID: userId,
        author: userId,
      };
      console.log(this.data.genres)
      this.editingFanfic = new Fanfic(fanficData, usersMap);

    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    get LoggedUser(): CredentialResponse {
      const auth = localStorage.getItem('auth');
      if (!auth) return new CredentialResponse();
      return JSON.parse(auth) as CredentialResponse;
    }
  }
