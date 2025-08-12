import { Component, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { ApiRequestService } from '../../services/api-request.service';
import { DynamicTableComponent, DynamicTableModule } from '@ciphersquare/dynamic-table';
import { ViewEditReleaseComponent } from './view-edit-release/view-edit-release.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReleaseActionComponent } from './release-action/release-action.component';
import { FileUploadService } from 'src/app/services/file-upload.service';

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
    @ViewChild(DynamicTableComponent) dynamicTable!: DynamicTableComponent;
    protected readonly environment = environment;
    protected httpHeaders: HttpHeaders;

    constructor(
        private _ApiRequestService: ApiRequestService,
        private _ModalService: NgbModal,
        private _FileUploadService: FileUploadService
    ) {
        this.httpHeaders = this._ApiRequestService.getTableApiHeaders();
    }
    async onTableAction($event: { type: string; row: any }) {
        console.log('Table action triggered:', $event);
        // 
        if ($event.type == 'escrow.release.edit' && ($event.row.status_txt === 'Partially Approved' || $event.row.status_txt === 'Pending')) {
            this.actionReleaseRequest($event?.row?.id);
        } if ($event.type == 'document') {
            const docUrl = $event.row?.document;
            if (docUrl) {
                 await this._FileUploadService.HandleFileOpen($event?.row?.raw_escrow_id, docUrl, 'release-action');
            } else {
                console.warn('No document URL found in event data');
            }
            // if (docUrl) {
            //     window.open(docUrl, '_blank');
            // } else {
            //     console.warn('No document URL found in event data');
            // }
        }
    }
    CreateReleaseRequest(): void {
        const modalRef = this._ModalService.open(ViewEditReleaseComponent, {
            size: 'lg',
            backdrop: 'static',
            centered: true
        })
        modalRef.closed.subscribe(() => {
            this.dynamicTable.refresh();
        });
    }
    actionReleaseRequest(id: string): void {
        const modalRef = this._ModalService.open(ReleaseActionComponent, {
            size: 'md',
            backdrop: 'static',
            centered: true
        })
        modalRef.componentInstance.escrowId = id;
        modalRef.closed.subscribe(() => {
            this.dynamicTable.refresh();
        });
    }
}
