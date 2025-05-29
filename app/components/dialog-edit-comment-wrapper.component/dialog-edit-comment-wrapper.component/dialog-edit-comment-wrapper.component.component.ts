import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { BookComment } from 'src/app/models/bookcomment';

@Component({
  selector: 'app-dialog-edit-comment-wrapper.component',
  templateUrl: './dialog-edit-comment-wrapper.component.component.html',
  styleUrls: ['./dialog-edit-comment-wrapper.component.component.css']
})
export class DialogEditCommentWrapperComponentComponent {
  editedComment: string;

  constructor(
     public dialogRef: MatDialogRef<DialogEditCommentWrapperComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { comment: BookComment }) {

  }

ngOnInit() {
  this.editedComment = this.data.comment.bookcomment;
}


  onSaveClick(): void {
   this.dialogRef.close({
  ...this.data.comment,
  bookcomment: this.editedComment
});
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
