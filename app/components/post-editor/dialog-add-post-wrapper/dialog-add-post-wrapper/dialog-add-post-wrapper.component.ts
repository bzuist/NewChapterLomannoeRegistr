import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Post } from 'src/app/models/post';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CredentialResponse } from 'src/app/models/auth/CredentialResponse';
import { User } from 'src/app/models/user';


@Component({
  selector: 'app-dialog-add-post-wrapper',
  templateUrl: './dialog-add-post-wrapper.component.html',
  styleUrls: ['./dialog-add-post-wrapper.component.css']
})
export class DialogAddPostWrapperComponent implements OnInit {

  addPost: Post;
  posts: Post[];

  constructor(public dialogRef: MatDialogRef<DialogAddPostWrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    const user = this.LoggedUser;

      const userId = user.userData?.id;
      const username = user.userData?.username;

      const usersMap = new Map<number, string>();
      if (userId && username) {
        usersMap.set(Number(userId), username);
      }

      const postcData = {
        ...this.data.post,
        userID: userId,
        author: userId,
      };
      this.addPost = new Post(this.data.post, new Map<number, string>());
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
