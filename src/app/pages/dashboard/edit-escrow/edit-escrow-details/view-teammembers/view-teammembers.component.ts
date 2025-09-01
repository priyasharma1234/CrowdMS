import { NgIf } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicTableComponent, DynamicTableModule } from '@ciphersquare/dynamic-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { apiRoutes } from 'src/app/config/api-request';
import { InputRestrictionDirective } from 'src/app/core/directives/InputRestriction/input-restriction.directive';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import { ShowErrorsComponent } from 'src/app/features/show-errors/show-errors.component';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { EditEscrowService } from 'src/app/services/edit-escrow.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-view-teammembers',
    imports: [DynamicTableModule, NgIf, FormsModule, ReactiveFormsModule, ShowErrorsComponent, InputRestrictionDirective],
    templateUrl: './view-teammembers.component.html',
    styleUrl: './view-teammembers.component.scss'
})
export class ViewTeammembersComponent {
    customParams: any;
    protected readonly environment = environment;
    protected httpHeaders: HttpHeaders;
    editTeamForm!: FormGroup;
    @ViewChild('editTeamModal') editTeamModal: any;
    @ViewChild(DynamicTableComponent) dynamicTable!: DynamicTableComponent;

    constructor(
        private _ApiRequestService: ApiRequestService,
        public _EditEscrowService: EditEscrowService,
        private _Router: Router,
        private fb: FormBuilder,
        private _NgxToasterService: NgxToasterService,
        private modalService: NgbModal,

    ) {
        if (this._EditEscrowService.escrowDetails == undefined) {
            this._Router.navigate(['dashboard']);
            return;
        }
        this.editTeamForm = this.fb.group({
            userid: ['', Validators.required],
            user_type: ['', Validators.required],
            rights: ['', Validators.required],
            name: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', [Validators.required, Validators.minLength(10)]],
        });
        const currentTab = this._EditEscrowService.selectedTabValue;
        this.customParams = {
            usertype: currentTab,
            escrow_id: this._EditEscrowService.escrowDetails.id
        };
        console.log("customParams1111", this.customParams)
        this.httpHeaders = this._ApiRequestService.getTableApiHeaders();
    }
    onTableAction($event: { type: string; row: any }) {
        console.log('Table action triggered:', $event);
        //  && $event?.row?.rights == 'edit'
        const row = $event.row;
        if ($event.type == 'corporate.team.edit') {

            this.editTeamForm.patchValue({
                userid: row.id,
                user_type: row.user_type,
                rights: row.rights,
                name: row.name,
                email: row.email,
                phone: row.phone || ''
            });
            this.modalService.open(this.editTeamModal, {
                centered: true,
                backdrop: 'static'
            });
        } else if ($event.type == 'corporate.team.emailResent') {
            Swal.fire({
                title: `Send email to ${row.name}?`,
                text: `Are you sure you want to re-send onboarding email to ${row.email}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, send',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.sendEmail(row?.id);
                }
            });
        }
    }
    sendEmail(id: any): void {
        this._ApiRequestService.postData({ payload: { id: id } }, apiRoutes.escrow.sendEmailTeamMember).subscribe({
            next: (res: any) => {
                if (res?.statuscode == 200) {
                    this.dynamicTable.refresh();
                    this._NgxToasterService.showSuccess(res?.message, 'Success');
                } else {
                    this._NgxToasterService.showError(res?.message, 'Error');
                }
            },
            error: (error: any) => {
                const errorMsg = error?.error?.message || error?.message;
                this._NgxToasterService.showError(errorMsg, 'Error');
            }
        });
    }
    submit(): void {
        this.editTeamForm.markAllAsTouched();
        if (this.editTeamForm.valid) {
            const payload = {
                ...this.editTeamForm.value
            };
            this._ApiRequestService.postData({ payload: payload }, apiRoutes.escrow.updateTeamMember).subscribe({
                next: (res: any) => {
                    if (res?.statuscode == 200) {
                        this.dynamicTable.refresh();
                        this.modalService.dismissAll();
                        this._NgxToasterService.showSuccess(res?.message, 'Success');
                    } else {
                        this._NgxToasterService.showError(res?.message, 'Error');
                    }
                },
                error: (error: any) => {
                    const errorMsg = error?.error?.message || error?.message;
                    this._NgxToasterService.showError(errorMsg, 'Error');
                }
            });
        }
    }

}
