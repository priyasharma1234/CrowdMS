import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { StoreService } from 'src/app/core/services/store.service';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import waitUntil from 'async-wait-until';
import { apiRoutes } from 'src/app/config/api-request';
import { PermissionListComponent } from '../../permission-management/permission-list/permission-list.component';




@Component({
    standalone: true,
    imports: [SharedModule, CommonModule,PermissionListComponent],
    selector: 'app-role-create',
    templateUrl: './role-create.component.html',
    styleUrls: ['./role-create.component.scss']
})
export class RoleCreateComponent implements OnInit {

    roleID: any;
    roleName: any = '';
    permissions: any;
    // userTypeMaster: Array<any> = [{ name: 'Admin' }, { name: 'Corporate' }];
    userType: any = '';
    roleNameStatic: any = "TEST";

    constructor(private router: Router, private sessionStorage: SessionStorageService,
        private _activatedRoute: ActivatedRoute, private store: StoreService,
        private _apiRequestService: ApiRequestService,
        private toaster: NgxToasterService) {
    }

    async ngOnInit() {
        this._activatedRoute.data.subscribe(async data => {
            if (data['userType']) {
                this.userType = data['userType']
            }

            if (data['edit']) {
                console.log("history.stateeeeeeeee", history)
                if (history.state.id != undefined) {
                    console.log("history.stateeeeeeeee", history.state)
                    this.sessionStorage.setItem('roles', history.state.id);
                    this.sessionStorage.setItem('roleName', history.state.roleName);
                    // this.sessionStorage.setItem('roleUserType', history.state.userType);
                    console.log("history.state.permissionedittttttttt", history.state.permission)
                    this.store.set('permissions', history.state.permission);
                    this.roleID = history.state.id;
                    // this.userType = history.state.userType;
                    this.roleName = history.state.roleName;
                    await waitUntil(() => this.permissions != undefined);
                    this.setPermissions(this.store.get('permissions'));
                } else {
                    this.roleID = this.sessionStorage.getItem('roles');
                    this.roleName = this.sessionStorage.getItem('roleName');
                    // this.userType = parseInt(this.sessionStorage.getItem('roleUserType')!);
                    let permissions = this.store.get('permissions');
                    await waitUntil(() => this.permissions != undefined);
                    this.setPermissions(permissions);
                }
                if (this.roleID == undefined) {
                    this.toaster.showError("No Role Selected", "Error");
                    this.router.navigate(this.userType == 'admin' ?['/roles/role-list'] : ['/staff/role-list']);
                }
            }
        });
        // this.userTypeMaster = (await this._apiRequestService.postDataAsync({}, config.user.getMasterData)).data;
    }

    private setPermissions(permissions: any) {
        if (typeof permissions === 'string') {
            try {
                permissions = JSON.parse(permissions);
            } catch (e) {
                console.error("Invalid permissions string", e);
                permissions = [];
            }
        }
        console.log("settttttttpermissions", permissions)
        let sysPermissions: Array<any> = [];

        this.permissions.forEach((element: any) => {
            element.permissions.forEach((perm: any) => {
                sysPermissions.push(perm);
            });
        });
        console.log("permissionssettt22", permissions);
        console.log("sysPermissionssettttttttttttt", sysPermissions)


        let intersection = sysPermissions.filter((x: any) => permissions.find((t: any) => t.name == x.name));

        intersection.forEach((element: any) => {
            element['enabled'] = true;
        });

        this.permissions.forEach((element: any) => {
            element['enabled'] = !element.permissions.some((t: any) => t.enabled == false);
        });
    }

    onSubmit() {
        let permissions: any = [];
        this.permissions.forEach((element: any) => {
            element.permissions.forEach((element: any) => {
                if (element.enabled) {
                    permissions.push(element.name);
                }
            });
        });
        console.log(" this.permissions1111111", this.permissions);
        console.log("userType11111111", this.userType)

        if (this.roleID == undefined) {
            this._apiRequestService.postDataAsync({
                role: this.roleName,
                permission: permissions,
                // permission: JSON.stringify(permissions),
                guard_name: this.userType
            }, apiRoutes.roles.roleCreate).then((data: any) => {
                if (data.statuscode == 200) {
                    this.toaster.showSuccess("Role Created Successfully", "Success");
                    this.router.navigate(this.userType == 'admin' ?['/roles/role-list'] : ['/staff/role-list']);
                }
            });
        } else {
            this._apiRequestService.postDataAsync({
                role: this.roleName,
                permission: permissions,
                // permission: JSON.stringify(permissions),
                id: this.roleID,
                guard_name: this.userType
            }, apiRoutes.roles.roleUpdate).then((data: any) => {
                if (data.statuscode == 200) {
                    this.toaster.showSuccess("Role Updated Successfully", "Success");
                    this.router.navigate(this.userType == 'admin' ?['/roles/role-list'] : ['/staff/role-list']);
                }
            });
        }

    }

    back() {
        if (window.history.length > 0) {
            window.history.back();
        } else {
            this.router.navigate(['/roles/role-list']);
        }
    }

    handleNameChange(event: any) {
        this.roleName = event.target.value;
    }
}
