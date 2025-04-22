import { authorities } from './../../models/authorities';
import { User } from './../../models/user';
import { principal } from './../../models/principal';
import { Fanfic } from 'src/app/models/fanfics';
import { MatPaginator } from '@angular/material/paginator';
import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { BaseServiceService } from 'src/app/service/base-service.service';
import { DialogEditWrapperComponent } from '../fanfic-editor/dialog-edit-wrapper/dialog-edit-wrapper.component';
import { DialogChangeWrapperComponent } from '../fanfic-editor/dialog-change-wrapper/dialog-change-wrapper.component';
import { DialogDeleteWrapperComponent } from '../fanfic-editor/dialog-delete-wrapper/dialog-delete-wrapper.component';
import { MatSort } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Genre } from 'src/app/models/genre';

@Component({
  selector: 'app-card',
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.css'],
})
export class CardComponent implements OnInit {
  fanfics: Fanfic[];
  user: User;
  onClickId:Number;
  genre: Genre[];
  checkuser: String;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private baseService: BaseServiceService,
              private router: Router,
              public dialog: MatDialog,
              ) {}


  ngOnInit() {
    console.log("CardComponent");
     this.baseService.getAllFanfics().subscribe(data => {this.fanfics = data});
    // this.checkuser = this.user.principal.authorities[0].authority;
  }
  ngAfterViewInit() {
    // this.fanfics.paginator = this.paginator;
    // this.fanfics.sort = this.sort;
  }

  addNewFanfic () {

    var addFic = new Fanfic({}, new Map<number, string>());

    this.baseService.getAllGenres().subscribe(data => {
      this.genre= data
      const dialogAddingNewFanfic = this.dialog.open(DialogEditWrapperComponent, {
        width: '400px',
        data: {
          fanfic: addFic,
          genres: this.genre,
        }

      });
      dialogAddingNewFanfic.afterClosed().subscribe((result: Fanfic) => {
        if(result != null) {
        console.log("Adding fanfic: " + result.name);
        this.baseService.addNewFanfic(result).subscribe(k=>
          { this.baseService.getAllFanfics().subscribe(data => {this.fanfics= data});
      })
    }})
    })

  }
  editFanfic(fanfic:Fanfic ) {

    var edFic = structuredClone(fanfic);

    const dialogChangingFanfic = this.dialog.open(DialogChangeWrapperComponent, {
      width: '400px',
      data: edFic,
    });

    dialogChangingFanfic.afterClosed().subscribe((result: Fanfic) => {
      if(result != null) {
      console.log("Changing fanfic: " + result.name);
      this.baseService.changeFanfic(result).subscribe(k=>
        { this.baseService.getAllFanfics().subscribe(data => {this.fanfics= data});
    })
  }}
)

  };

  deleteFanfic(fanfic: Fanfic) {
    this.baseService.deleteFanfic(fanfic.id).subscribe(k=>
      this.baseService.getAllFanfics().subscribe(data => this.fanfics = data)
    );
  }

  readFanfic(id:number){
    this.router.navigate(['readComponent', id])
    console.log(id)
  }

}

