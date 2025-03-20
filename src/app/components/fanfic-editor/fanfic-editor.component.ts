import { Component, OnInit, Input } from '@angular/core';
import { Fanfic } from '../../models/fanfics';
import { BaseServiceService } from 'src/app/service/base-service.service';

@Component({
  selector: 'app-fanfic-editor',
  templateUrl: './fanfic-editor.component.html',
  styleUrls: ['./fanfic-editor.component.css']
})
export class FanficEditorComponent implements OnInit {

  @Input() data: { fanfic: any };

  editingFanfic: Fanfic;

  constructor(private baseService: BaseServiceService) { }

  ngOnInit() {
    this.editingFanfic = new Fanfic(this.data.fanfic, new Map<number, string>());
  }

  addFanfic() {
    this.baseService.addNewFanfic(this.editingFanfic);
    this.editingFanfic = new Fanfic(this.data.fanfic, new Map<number, string>());
  }
}
