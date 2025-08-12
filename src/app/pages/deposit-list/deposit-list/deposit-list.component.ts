import { HttpHeaders } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { DynamicTableComponent, DynamicTableModule } from '@ciphersquare/dynamic-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-deposit-list',
    imports: [DynamicTableModule],
    templateUrl: './deposit-list.component.html',
    styleUrl: './deposit-list.component.scss',
        standalone: true,
})
export class DepositListComponent {
    @ViewChild(DynamicTableComponent) dynamicTable!: DynamicTableComponent;
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
        // 
        if ($event.type == 'escrow.release.edit' && ($event.row.status_txt === 'Partially Approved' || $event.row.status_txt === 'Pending')) {
            this.actionReleaseRequest($event?.row?.id);
        } if ($event.type == 'document') {
            const docUrl = $event.row?.document;
            if (docUrl) {
                window.open(docUrl, '_blank');
            } else {
                console.warn('No document URL found in event data');
            }
        }
    }

    actionReleaseRequest(id: string): void {
        //     const modalRef = this._ModalService.open(ReleaseActionComponent, {
        //         size: 'md',
        //         backdrop: 'static',
        //         centered: true
        //     })
        //     modalRef.componentInstance.escrowId = id;
        //     modalRef.closed.subscribe(() => {
        //         this.dynamicTable.refresh();
        //     });
    }
}
