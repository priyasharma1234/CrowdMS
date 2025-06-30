import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { Router, RouterModule } from "@angular/router";
import { SharedModule } from 'src/app/shared/shared.module';
import { DynamicTableModule } from '@ciphersquare/dynamic-table';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import { ApiRequestService } from 'src/app/services/api-request.service';

@Component({
    selector: 'app-staff-list',
    standalone: true,
    imports: [DynamicTableModule, RouterModule, SharedModule],
    templateUrl: './staff-list.component.html',
    styleUrl: './staff-list.component.scss'
})
export class StaffListComponent {
    httpHeaders: any;

    constructor(private _ApiRequestService: ApiRequestService, private router: Router) {
        this.httpHeaders = this._ApiRequestService.getTableApiHeaders();
        console.log("httpHeaders", this.httpHeaders)
    }

    async ngOnInit(): Promise<void> {


    }

   onTableAction(event: any) {
        console.log('Table action triggered:', event);
        if (event.type === 'edit') {
            this.router.navigate(['/staff/edit-staff', event?.row?.id]);
        }
    }

    // OnEdit(item: any) {
    //     this.router.navigate(['/staff/edit-staff', item.id]);
    // }

    // OnDelete(item: any) {
    //     Swal.fire({
    //         title: 'Are you sure?',
    //         text: `Do you want to delete ${item.name} staff!`,
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonText: 'Yes, Confirm',
    //         cancelButtonText: 'No, cancel!',
    //         reverseButtons: true,
    //     }).then(async (result) => {
    //         if (result.isConfirmed) {
    //             const formdata = new FormData();
    //             formdata.append('id', item.id);
    //             try {
    //                 const resp = await lastValueFrom(this._StaffService.deleteStaff(formdata));

    //                 if (resp?.statuscode === 200) {
    //                     this._NgxToasterService.showSuccess(resp.message, 'Success');
    //                     this.GetStaffList();
    //                 } else {
    //                     this._NgxToasterService.showError(resp?.message, 'Error');
    //                 }
    //             } catch (error: any) {
    //                 const errorMsg =
    //                     error?.error?.message || error?.message;

    //                 this._NgxToasterService.showError(errorMsg, 'Error');
    //             }
    //         } else if (result.dismiss === Swal.DismissReason.cancel) {
    //         }
    //     });
    // }
    // async OnUpdateStatus(item: any) {
    //      const { permissions, ...data } = item;
    //     try {
    //         const resp = await lastValueFrom(this._StaffService.updateStaff(data));
    //         if (resp?.statuscode === 200) {
    //             this._NgxToasterService.showSuccess(resp.message, 'Success');
    //             this.GetStaffList();
    //         } else {
    //             this._NgxToasterService.showError(resp?.message, 'Error');
    //         }
    //     } catch (error: any) {
    //         const errorMsg =
    //             error?.error?.message || error?.message;

    //         this._NgxToasterService.showError(errorMsg, 'Error');
    //     }

    // }
}


