import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { ApiRequestService } from '../../services/api-request.service';
import { DynamicTableModule } from '@ciphersquare/dynamic-table';
import { ViewEditReleaseComponent } from './view-edit-release/view-edit-release.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReleaseActionComponent } from './release-action/release-action.component';

@Component({
  selector: 'app-release',
  imports: [
    DynamicTableModule
  ],
  templateUrl: './release.component.html',
  styleUrl: './release.component.scss',
  standalone: true
})
export class ReleaseComponent {

  protected readonly environment = environment;
  protected httpHeaders: HttpHeaders;

  constructor(
    private _ApiRequestService: ApiRequestService,
    private _ModalService: NgbModal
  ) {
    this.httpHeaders = this._ApiRequestService.getTableApiHeaders();
  }
  onTableAction($event: { type: string; row: any }) {
    console.log('Table action triggered:', $event);
    if ($event.type == 'escrow.release.edit') {
      this.actionReleaseRequest($event?.row?.id);
    }
  }
  CreateReleaseRequest(): void {
    const modalRef = this._ModalService.open(ViewEditReleaseComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true
    })
    modalRef.componentInstance.cancelForm.subscribe((result: string) => {
      modalRef.close();
    })
  }
  actionReleaseRequest(id:string): void {
    const modalRef = this._ModalService.open(ReleaseActionComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true
    })
    modalRef.componentInstance.escrowId = id;
    modalRef.componentInstance.cancelForm.subscribe((result: string) => {
      modalRef.close();
    })
  }
}
