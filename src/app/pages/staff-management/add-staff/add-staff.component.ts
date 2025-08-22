import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import waitUntil from 'async-wait-until';
import { lastValueFrom } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import { regExpPattern } from 'src/app/core/validators/regExpPatternList';
import { staffService } from 'src/app/services/staffService';
import { ShowErrorsComponent } from 'src/app/features/show-errors/show-errors.component';
import { InputRestrictionDirective } from 'src/app/core/directives/InputRestriction/input-restriction.directive';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UppercaseDirective } from 'src/app/core/directives/uppercase/uppercase.directive';

@Component({
    selector: 'app-add-staff',
    standalone: true,
    imports: [CommonModule, SharedModule, ShowErrorsComponent, InputRestrictionDirective,UppercaseDirective],
    templateUrl: './add-staff.component.html',
    styleUrl: './add-staff.component.scss'
})
export class AddStaffComponent {
    editable: boolean = false;
    @Input() editId: string;
    roleList: any;
    permissions: any = undefined;
    formState: 'user' | 'permissions' = 'user';
    private userPermissions: any;
    addStaffForm: FormGroup;
    staffData: any
    constructor(
        public activeModal: NgbActiveModal,
        private fb: FormBuilder,
        private _NgxToasterService: NgxToasterService,
        private router: Router,
        private _StaffService: staffService
    ) {
        this.addStaffForm = this.fb.group({
            role: ['', Validators.required],
            name: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.pattern(regExpPattern['email'])]],
            phone: ['', [Validators.required, Validators.minLength(10)]],
            // rights: ['', Validators.required]
        });
    }


    async ngOnInit() {
        this.roleList = await lastValueFrom(this._StaffService.getStaffRoleList({}));
        console.log("this.roleList", this.roleList)
        if (this.editId) {
            this.editable = true;
            this.loadDataForEdit(this.editId);
            this.addStaffForm.get('role')?.disable();
        } else {
            this.addStaffForm.get('role')?.enable();
        }
    }
    async addStaff() {
        this.addStaffForm.markAllAsTouched();
        const formValue = this.addStaffForm.getRawValue();

        if (this.addStaffForm.valid) {
            const data = {
                ...formValue,
                ...(this.editable && this.editId ? { id: this.editId } : {}),
                  ...(this.editable && this.editId ? { status: this.staffData?.status } : {})
            };
            try {
                let resp;
                if (this.editable) {
                    resp = await lastValueFrom(this._StaffService.updateStaff({ payload: data, form: this.addStaffForm }));
                } else {
                    resp = await lastValueFrom(this._StaffService.addStaff({ payload: data, form: this.addStaffForm }));
                }

                if (resp?.statuscode === 200) {
                    this._NgxToasterService.showSuccess(resp.message, "Success");
                    this.activeModal.close()
                } else {
                    this._NgxToasterService.showError(resp?.message, "Error");
                }
            } catch (error: any) {
                const errorMsg =
                    error?.error?.message || error?.message;
                this._NgxToasterService.showError(errorMsg, 'Error');
            }
        }
    }
    async loadDataForEdit(id: string) {
        try {
            const resp = await lastValueFrom(this._StaffService.getStaffById(id));
            if (resp?.statuscode == 200) {
                if (resp.data) {
                    this.staffData = resp.data;
                    this.addStaffForm.patchValue({
                        role: this.staffData?.role,
                        name: this.staffData?.name,
                        username: this.staffData?.username,
                        email: this.staffData?.email,
                        phone: this.staffData?.phone,
                        // rights: this.staffData?.rights
                    });
                    this.userPermissions = resp.data.permissions;
                    this._NgxToasterService.showSuccess(resp.message, "Success");
                }


            } else {
                this._NgxToasterService.showError(resp?.message, 'Error');
            }
        } catch (error: any) {
            const errorMsg =
                error?.error?.message || error?.message;
            this._NgxToasterService.showError(errorMsg, 'Error');
        }

    }
    onOpen() {
        this.formState = 'permissions';
        if (this.permissions == undefined) {
            this.setPermission(this.userPermissions.rolePermissions, 'Off');
            this.setPermission(this.userPermissions.customPermissions);
        }
    }
    private async setPermission(permissions: any, overrideCSS: string = 'enabled') {


        await waitUntil(() => this.permissions != undefined);

        permissions.forEach((permission: any) => {
            let perm = this.permissions.find((perm: any) => perm.module == permission.module);
            if (perm) {

                permission.permission.forEach((p: any) => {
                    let p2 = perm.permissions.find((p3: any) => p3.name == p);
                    console.log(p2);

                    if (p2) {
                        p2[overrideCSS] = true;
                    }
                });
                perm[overrideCSS] = perm.permissions.every((p: any) => p[overrideCSS]);
            }
        });

    }

    async onSubmit() {
        let permissions: any = [];
        this.permissions.forEach((element: { permissions: any[]; }) => {
            element.permissions.forEach(element => {
                if (element.enabled) {
                    permissions.push(element.name);
                }
            });
        });

        let resp;
        if (this.editable) {
            const staffData = this.addStaffForm.getRawValue();
            let data = {
                ...staffData,
                permissions: JSON.stringify(permissions),
                id: this.editId,
                gaurd_name: 'admin'
            }
            resp = await lastValueFrom(this._StaffService.updateStaff({ payload: data, form: this.addStaffForm }));
            if (resp.statuscode == 200)
                this._NgxToasterService.showSuccess(resp.message, 'Success')
            this.router.navigate(['/staff/staff-list']);
        }
    }

}


