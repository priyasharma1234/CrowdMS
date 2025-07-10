import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';
import { apiRoutes } from 'src/app/config/api-request';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import { ShowErrorsComponent } from 'src/app/features/show-errors/show-errors.component';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { EscrowService } from 'src/app/services/escrow.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
    selector: 'app-view-edit-release',
    imports: [NgIf, NgForOf, CommonModule, ReactiveFormsModule, FormsModule, ShowErrorsComponent],
    templateUrl: './view-edit-release.component.html',
    styleUrl: './view-edit-release.component.scss'
})
export class ViewEditReleaseComponent implements OnInit {
    releaseForm: FormGroup;
    selectedCondition: string | null = 'Bankruptcy';
    uploadedFile: File | null = null;
    conditions: any;
    protected fileUrl: string | undefined;
    remarks: any;
    escrowList: Array<any> = [];
    @Input() escrowId: number;

    constructor(
        private _FormBuilder: FormBuilder,
        private _ApiRequestService: ApiRequestService,
        private _NgxToasterService: NgxToasterService,
        private _FileUploadService: FileUploadService,
        public _ActiveModal: NgbActiveModal,
        private _EscrowService: EscrowService
    ) {
        this.conditions = []
        this.releaseForm = this._FormBuilder.group({
            escrow_id: ['', Validators.required],
            reason: ['', Validators.required],
            remarks: ['', Validators.required]
        });
    }
    async ngOnInit() {
        const response = await lastValueFrom(this._EscrowService.getEscorwList());
        this.escrowList = response?.data || [];
        if (this.escrowId) {
            this.releaseForm.patchValue({
                escrow_id: this.escrowId
            })
            const response = await lastValueFrom(this._EscrowService.getReleaseConditionsList({ payload: { id: this.escrowId.toString() } }));
            this.conditions = response?.data || [];
            this.releaseForm.get('escrow_id')?.disable()
        } else {
            this.releaseForm.get('escrow_id')?.enable()
        }
    }

    async onEscrowChange(event: any) {
        let escrowId = event.target.value;
        console.log("escrowId111111111111", escrowId)
        if (escrowId) {
            const response = await lastValueFrom(this._EscrowService.getReleaseConditionsList({ payload: { id: escrowId } }));
            console.log("conditionsresponseeeeeeeeee", response)
            this.conditions = response?.data || [];
        }

        this.releaseForm.get('condition')?.setValue(''); // Reset condition
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this._FileUploadService.uploadDocument(input.files[0], 'release-request').subscribe({
                next: (fileUrl: string) => {
                    this.fileUrl = fileUrl;
                },
                error: (err: Error) => {
                    console.error('File upload failed:', err);
                }
            });
        } else {
            this.uploadedFile = null;
            console.log('No file selected');
        }
    }

    submit(): void {
        this.releaseForm.markAllAsTouched();
        if (!this.fileUrl) {
            this._NgxToasterService.showError("Please upload a document", 'Error');
            return;
        }
        if (this.releaseForm.valid) {
            const formData = this.releaseForm.getRawValue();
            formData.id = this.escrowId;
            const payload = {
                ...formData,
                document: this.fileUrl
            };
            this._ApiRequestService
                .postData({ payload }, apiRoutes.release.addRelease)
                .subscribe({
                    next: (res: any) => {
                        if (res?.statuscode === 200) {
                            this._ActiveModal.close();
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

            console.log('Release Request payload:', payload);
        }
    }


    cancel(): void {
        this._ActiveModal.close();
    }
}
