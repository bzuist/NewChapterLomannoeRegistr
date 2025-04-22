import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-dialog-delete-post-wrapper',
  templateUrl: './dialog-delete-post-wrapper.component.html',
  styleUrls: ['./dialog-delete-post-wrapper.component.css']
})
export class DialogDeletePostWrapperComponent implements OnInit {

  deletePost: Post;

  constructor(public dialogRef: MatDialogRef<DialogDeletePostWrapperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.deletePost = new Post(this.data, new Map<number, string>());
  }
  onNoClick(): void {
    this.dialogRef.close(false);
  }
  onDeleteClick(): void {
    this.dialogRef.close(true);
  }

}

