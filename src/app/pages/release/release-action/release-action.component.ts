import { NgForOf, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { apiRoutes } from 'src/app/config/api-request';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import { ShowErrorsComponent } from 'src/app/features/show-errors/show-errors.component';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
    selector: 'app-release-action',
    imports: [NgIf, NgForOf, ReactiveFormsModule, FormsModule, ShowErrorsComponent],
    templateUrl: './release-action.component.html',
    styleUrl: './release-action.component.scss'
})
export class ReleaseActionComponent {
    releaseForm: FormGroup;
    uploadedFile: File | null = null;
    fileUrl: string | undefined;
    remarks: string = '';
    selectedRequestValue: number | null = null;
    @Input() escrowId: string
    requestTypes = [
        { label: 'Approve', value: 1 },
        { label: 'Reject', value: 0 }
    ];

    constructor(
        private fb: FormBuilder,
        private _ApiRequestService: ApiRequestService,
        private _NgxToasterService: NgxToasterService,
        private _FileUploadService: FileUploadService,
        public activeModal: NgbActiveModal
    ) {
        this.releaseForm = this.fb.group({
            remarks: ['', [Validators.required]]
        });
    }

    selectRequestType(type: { label: string, value: number }): void {
        this.selectedRequestValue = type.value;
    }
    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        this.uploadedFile = file;
        this._FileUploadService.uploadDocument(file, 'release-request').subscribe({
            next: (url: string) => {
                this.fileUrl = url;
            },
            error: (err) => {
                console.error('File upload failed', err);
            }
        });
    }

    submit(): void {
        this.releaseForm.markAllAsTouched();
        if (!this.fileUrl) {
            this._NgxToasterService.showError("Please upload a document", 'Error');
            return
        }
           if (!this.selectedRequestValue) {
            this._NgxToasterService.showError("Please elect release request", 'Error');
            return
        }
        if (this.releaseForm.valid) {
            const payload = {
                id: this.escrowId,
                status: this.selectedRequestValue,
                remarks: this.releaseForm.get('remarks')?.value || '',
                document: this.fileUrl,
            };

            this._ApiRequestService.postData({ payload }, apiRoutes.release.takeAction).subscribe({
                next: (res) => {
                    if (res?.statuscode === 200) {
                        this.activeModal.close();
                    } else {
                        this._NgxToasterService.showError(res?.message, 'Error');
                    }
                },
                error: (error) => {
                    const errorMsg = error?.error?.message || error?.message;
                    this._NgxToasterService.showError(errorMsg, 'Error');
                }
            });
        }

    }
}