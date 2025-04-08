import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-dialog-change-post-wrapper',
  templateUrl: './dialog-change-post-wrapper.component.html',
  styleUrls: ['./dialog-change-post-wrapper.component.css']
})
export class DialogChangePostWrapperComponent implements OnInit {

  changePost: Post;

  constructor(public dialogRef: MatDialogRef<DialogChangePostWrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.changePost = new Post(this.data.post, new Map<number, string>()); }

  ngOnInit(): void {
    this.dialogRef.close(this.changePost);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
