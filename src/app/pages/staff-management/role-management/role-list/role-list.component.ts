import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { lastValueFrom } from "rxjs";
import Swal from "sweetalert2";
import { PermissionServiceService } from "src/app/core/services/permission-service.service";
import { staffService } from "src/app/services/staffService";
import { SharedModule } from "src/app/shared/shared.module";
import { NgxToasterService } from "src/app/core/services/toasterNgs.service";
import { DynamicTableModule } from "@ciphersquare/dynamic-table";

@Component({
    standalone: true,
    imports: [RouterModule, SharedModule, DynamicTableModule],
    selector: 'app-role-list',
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {
    httpHeaders: any;
    customParams:any;
    constructor(
        private _NgxToasterService: NgxToasterService,
        private _Router: Router,
        private _staffService: staffService,
        private _activatedRoute: ActivatedRoute,
        public permissionService: PermissionServiceService
    ) {
        this.customParams = {
            gaurd_name: 'admin',
        };
    }

    async ngOnInit(): Promise<void> {

    }


    onTableAction(event: any) {
        console.log('Table action triggered:', event);
        if (event.type === 'edit') {
            this._Router.navigate(['/staff/role-edit'], {
                state: {
                    id: event?.row?.id,
                    roleName: event?.row?.name,
                    permission: event?.row?.permissionCopy,
                    userType: event?.row?.user_type
                }
            });
        }
    }
    // OnEdit(item: any) {
    //     console.log(item);
    //     this._Router.navigate(this.userType == 'admin' ? ['/roles/role-edit'] : ['/staff/role-edit'], {
    //         state: {
    //             id: item.id,
    //             roleName: item.name,
    //             permission: item.permissionCopy,
    //             userType: item.user_type
    //         }
    //     });
    // }
    // OnDelete(item: any) {
    //     Swal.fire({
    //         title: 'Are you sure?',
    //         text: `Do you want to delete ${item.name} role!`,
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonText: 'Yes, Confirm',
    //         cancelButtonText: 'No, cancel!',
    //         reverseButtons: true,
    //     }).then(async (result) => {
    //         if (result.isConfirmed) {
    //             const formdata = new FormData();
    //             formdata.append('id', item.id);
    //             formdata.append('guard_name', this.userType);
    //             try {
    //                 const resp = await lastValueFrom(this._staffService.deleteRole(formdata));

    //                 if (resp?.statuscode === 200) {
    //                     this._NgxToasterService.showSuccess(resp.message, 'Success');
    //                     this.GetRolesList();
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


}


