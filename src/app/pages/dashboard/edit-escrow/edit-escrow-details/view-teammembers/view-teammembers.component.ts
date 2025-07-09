import { NgIf } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicTableModule } from '@ciphersquare/dynamic-table';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { EditEscrowService } from 'src/app/services/edit-escrow.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-teammembers',
  imports: [DynamicTableModule, NgIf],
  templateUrl: './view-teammembers.component.html',
  styleUrl: './view-teammembers.component.scss'
})
export class ViewTeammembersComponent {
  customParams: any;
  protected readonly environment = environment;
  protected httpHeaders: HttpHeaders;

  constructor(
    private _ApiRequestService: ApiRequestService,
    public _EditEscrowService: EditEscrowService,
    private _Router: Router
  ) {
    if (this._EditEscrowService.escrowDetails == undefined) {
      this._Router.navigate(['dashboard']);
      return;
    }
    const currentTab = this._EditEscrowService.selectedTabValue;
    this.customParams = {
      usertype: currentTab,
      escrow_id: this._EditEscrowService.escrowDetails.id
    };
    console.log("customParams1111", this.customParams)
    this.httpHeaders = this._ApiRequestService.getTableApiHeaders();
  }
  onTableAction($event: { type: string; row: any }) {
    console.log('Table action triggered:', $event);
  }

}
