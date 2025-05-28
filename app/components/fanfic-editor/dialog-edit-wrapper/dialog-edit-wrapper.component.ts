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
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

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
  selectedGenres: number[] = [];

  constructor(public dialogRef: MatDialogRef<DialogEditWrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
  this.genres = this.data.genres || [];
  console.log("Genres:", this.genres);

  const user = this.LoggedUser;

  if (!user || !user.userData?.id || !user.name) {
    console.error("Пользователь не авторизован или данные некорректны");
    return;
  }
  const userId = +user.userData?.id;
  const username = user.name;

  const usersMap = new Map<number, string>();
  if (userId && username) {
    usersMap.set(userId, username);
  }

  this.selectedGenres = this.data.fanfic.genreID
    ? this.data.fanfic.genreID
        .map((id: string | number) => Number(id))
        .filter((id: number) => !isNaN(id))
    : [];

  const fanficData = {
    ...this.data.fanfic,
    userID: userId,
    author: userId,
    genreID: this.selectedGenres, 
  };

  console.log("Processed fanficData:", fanficData);

  this.editingFanfic = new Fanfic(fanficData, usersMap);

  console.log("Username:", username, "UserID:", userId);

  console.log('selectedGenres:', this.selectedGenres);

}

onSave(): void {
  this.editingFanfic.genreID = this.selectedGenres;
  this.dialogRef.close(this.editingFanfic);
}
    onNoClick(): void {
      this.dialogRef.close();
    }

    get LoggedUser(): CredentialResponse {
      const auth = localStorage.getItem('auth');
      if (!auth) return new CredentialResponse();
      return JSON.parse(auth) as CredentialResponse;
    }
    
    get userDisplayName(): string {
      return this.LoggedUser?.name || 'Неизвестный пользователь';
    }

    decodeHtml(html: string): string {
      const txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    }

    toNumber(value: any): number {
  return Number(value);
}
}