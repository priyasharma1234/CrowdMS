import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { Router, RouterModule } from "@angular/router";
import { SharedModule } from 'src/app/shared/shared.module';
import { DynamicTableComponent, DynamicTableModule } from '@ciphersquare/dynamic-table';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { staffService } from 'src/app/services/staffService';
import { AddStaffComponent } from '../add-staff/add-staff.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-staff-list',
    standalone: true,
    imports: [DynamicTableModule, RouterModule, SharedModule],
    templateUrl: './staff-list.component.html',
    styleUrl: './staff-list.component.scss'
})
export class StaffListComponent {
    httpHeaders: any;
    @ViewChild(DynamicTableComponent) dynamicTable!: DynamicTableComponent;
    private _StaffService = inject(staffService);
    private _NgxToasterService = inject(NgxToasterService)

    constructor(private _ApiRequestService: ApiRequestService, private router: Router,
        private modalService: NgbModal
    ) {
        this.httpHeaders = this._ApiRequestService.getTableApiHeaders();
        console.log("httpHeaders", this.httpHeaders)
    }

    async ngOnInit(): Promise<void> {


    }
  openModal(id?:any) { 
        const modalRef = this.modalService.open(AddStaffComponent, {
            centered: true,
            size: 'lg',
            backdrop: 'static',
            keyboard: false
        });
         modalRef.componentInstance.editId = id;
        modalRef.result.finally(() => {

        });
    }
    onTableAction(event: any) {
        console.log('Table action triggered:', event);
        if (event.type === 'edit') {
            // this.router.navigate(['/staff/edit-staff', event?.row?.id]);
            this.openModal(event?.row?.id)
        } else if (event.type === 'selectChange') {
            console.log('New select value:', event.row);
            this.OnUpdateStatus(event.row)
        } else if (event.type === 'delete') {
            console.log('New select value:', event.row);
            this.OnDelete(event.row)
        }
    }
    async OnUpdateStatus(item: any) {
        const data = {
            ...item
        };
        try {
            const resp = await lastValueFrom(this._StaffService.updateStaff(data));
            if (resp?.statuscode === 200) {
                this._NgxToasterService.showSuccess(resp.message, 'Success');
                this.dynamicTable.refresh();
            } else {
                this._NgxToasterService.showError(resp?.message, 'Error');
            }
        } catch (error: any) {
            const errorMsg =
                error?.error?.message || error?.message;

            this._NgxToasterService.showError(errorMsg, 'Error');
        }

    }
    OnDelete(item: any) {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${item.name} staff!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Confirm',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const formdata = new FormData();
                formdata.append('id', item.id);
                try {
                    const resp = await lastValueFrom(this._StaffService.deleteStaff(formdata));

                    if (resp?.statuscode === 200) {
                        this._NgxToasterService.showSuccess(resp.message, 'Success');
                        this.dynamicTable.refresh();
                    } else {
                        this._NgxToasterService.showError(resp?.message, 'Error');
                    }
                } catch (error: any) {
                    const errorMsg =
                        error?.error?.message || error?.message;

                    this._NgxToasterService.showError(errorMsg, 'Error');
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
            }
        });
    }
 protected readonly environment = environment;
}


