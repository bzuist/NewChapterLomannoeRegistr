import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Post } from 'src/app/models/post';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';


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
    console.log(this.data.genres)
      this.addPost = new Post(this.data.fanfic, new Map<number, string>());
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
