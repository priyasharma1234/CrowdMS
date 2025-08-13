import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DynamicTableComponent, DynamicTableModule } from '@ciphersquare/dynamic-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { environment } from 'src/environments/environment';
import { SidebarService } from '../sidebar/sidebar-service.service';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { DepositListSoftwareComponent } from './deposit-list-software/deposit-list-software.component';

@Component({
    selector: 'app-deposits',
    imports: [DynamicTableModule],
    templateUrl: './deposits.component.html',
    styleUrl: './deposits.component.scss'
})
export class DepositsComponent implements OnInit {
    @ViewChild(DynamicTableComponent) dynamicTable!: DynamicTableComponent;
    protected readonly environment = environment;
    protected httpHeaders: HttpHeaders;

    constructor(
        private _ApiRequestService: ApiRequestService,
        private _ModalService: NgbModal,
        private _SidebarService: SidebarService,
        private _SessionStorageService: SessionStorageService,

    ) {
        this.httpHeaders = this._ApiRequestService.getTableApiHeaders();
    }
    ngOnInit() {
        this._SidebarService.selectedItemActive = 'Deposit';
        this._SessionStorageService.setItem('selectd_item', 'Deposit');
    }
    onTableAction($event: { type: string; row: any }) {
        console.log('Table action triggered:', $event);
        if ($event.type == 'edit') {
             const modalRef = this._ModalService.open(DepositListSoftwareComponent, {
                size: 'xl',
                backdrop: 'static',
                centered: true
            })
             modalRef.componentInstance.depositDetails = $event?.row;
             modalRef.componentInstance.viewMode = true
            modalRef.closed.subscribe(() => {
                this.dynamicTable.refresh();
            });
        }
    }

    // actionReleaseRequest(id: string): void {
    //         const modalRef = this._ModalService.open(DepositListSoftwareComponent, {
    //             size: 'md',
    //             backdrop: 'static',
    //             centered: true
    //         })
    //          modalRef.componentInstance.escrowId = id;
    //         modalRef.closed.subscribe(() => {
    //             this.dynamicTable.refresh();
    //         });
    // }
}
