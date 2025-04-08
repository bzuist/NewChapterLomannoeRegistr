import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-userpage.settings',
  templateUrl: './userpage.settings.component.html',
  styleUrls: ['./userpage.settings.component.css']
})
export class UserpageSettingsComponent implements OnInit {
  editUser: User;

  constructor(
    public dialogRef: MatDialogRef<UserpageSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.editUser = { ...this.data };
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onSaveClick(): void {
    this.dialogRef.close(this.editUser);
  }
}
