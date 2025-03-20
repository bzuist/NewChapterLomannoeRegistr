import { User } from './models/user';
import { Component } from '@angular/core';
import { BaseServiceService } from 'src/app/service/base-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Alex';
  user: User[];

  constructor(private baseService: BaseServiceService,

    ) {

    }

}
