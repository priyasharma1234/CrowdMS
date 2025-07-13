import {Component, ViewChild} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpHeaders} from '@angular/common/http';
import {ApiRequestService} from '../../services/api-request.service';
import {DynamicTableComponent, DynamicTableModule} from '@ciphersquare/dynamic-table';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ViewEditRequestComponent} from './view-edit-request/view-edit-request.component';
import {RequestActionComponent} from './request-action/request-action.component';
import {FormsModule} from '@angular/forms';
import {NgxToasterService} from '../../core/services/toasterNgs.service';

@Component({
  selector: 'app-requests',
  imports: [
    DynamicTableModule,
    FormsModule
  ],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss',
  standalone: true
})
export class RequestsComponent {
  @ViewChild(DynamicTableComponent) dynamicTable!: DynamicTableComponent;
  protected readonly environment = environment;
  protected httpHeaders: HttpHeaders;
  selectedStatus: string = '2';

  constructor(
    private _ApiRequestService: ApiRequestService,
    private _ModalService: NgbModal,
    private _ToasterService: NgxToasterService
  ) {
    this.httpHeaders = this._ApiRequestService.getTableApiHeaders();
  }

  onTableAction($event: { type: string; row: any }) {
    console.log('Table action triggered:', $event);
    if (['escrow.release.approve', 'escrow.release.reject'].includes($event.type)) {
      if ($event.row.status != 2) {
        this._ToasterService.showError('You can only edit Requests that are in draft state.', 'Error');
        return;
      }
    }
    this.actionReleaseRequest($event?.row, $event.type);

  }

  CreateReleaseRequest(): void {
    const modalRef = this._ModalService.open(ViewEditRequestComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true
    })
    modalRef.closed.subscribe(() => {
      this.dynamicTable.refresh();
    });
  }

  actionReleaseRequest(escrow: any, _type: string): void {
    const modalRef = this._ModalService.open(RequestActionComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true
    })
    modalRef.componentInstance.escrowId = escrow.id;
    modalRef.componentInstance.escrow = escrow;
    modalRef.componentInstance.heading = _type === 'escrow.release.approve' ? 'Approve Request' : 'Reject Request';
    modalRef.componentInstance.selectedRequestStatus = _type === 'escrow.release.approve' ? 1 : 0;
    modalRef.componentInstance.viewMode = _type === 'escrow.release.view';
    modalRef.closed.subscribe(() => {
      this.dynamicTable.refresh();
    });
  }
}
