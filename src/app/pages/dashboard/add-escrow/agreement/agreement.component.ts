import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CustomDatepickerComponent } from 'src/app/core/custom-datepicker/custom-datepicker.component';
import { CustConfg } from 'src/app/core/custom-datepicker/ngx-datePicker-CustConfg';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import { apiRoutes } from 'src/app/config/api-request';
// import { CustomDatepickerComponent } from '@core/custom-datepicker/custom-datepicker.component';
// import { CustConfg } from '@core/custom-datepicker/ngx-datePicker-CustConfg';

@Component({
    selector: 'app-agreement',
    imports: [SharedModule, CustomDatepickerComponent, BsDatepickerModule],
    templateUrl: './agreement.component.html',
    styleUrl: './agreement.component.scss'
})
export class AgreementComponent implements OnInit {
    datepickerConfig = {
        container: 'body',
        containerClass: 'theme-blue'
    } as any;
    endMinScheduleDate!: Date;
    bsCustConfg = CustConfg;
    agreementForm: FormGroup;
    agreementDocumentForm: FormGroup;

    constructor(private fb: FormBuilder, private modalService: NgbModal, private _ApiRequestService: ApiRequestService, private _NgxToasterService: NgxToasterService) {
        const date = new Date();
        this.endMinScheduleDate = date;
        this.agreementForm = this.fb.group({
            agreementType: [''],
            additional_docs: this.fb.array([]),
        },
        );
        this.agreementDocumentForm = this.fb.group({
            signing_date: ['', Validators.required],
            effective_date: ['', Validators.required],
            expiry_date: ['', Validators.required],
            document_url: ['', Validators.required]
        });

    }
    ngOnInit(): void {
    }
    get additionalDocs(): FormArray {
        return this.agreementForm.get('additional_docs') as FormArray;
    }

    createDocumentGroup(file: File): FormGroup {
        return this.fb.group({
            file: [file],
            url: ['']
        });
    }
    onMultiFileSelect(event: any) {
        const inputEl = event.target;
        const files: File[] = Array.from(inputEl.files);
        const allowedTypes = [
            'application/pdf',
            'image/png',
            'image/jpeg',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        for (const file of files) {
            if (!allowedTypes.includes(file.type)) {
                this._NgxToasterService.showError(`${file.name} is not an allowed file type.`, 'Invalid File');
                inputEl.value = '';  // ✅ Clear input
                return; // Skip further processing
            }

            if (file.size > 5 * 1024 * 1024) {
                this._NgxToasterService.showError(`${file.name} exceeds 5MB`, 'File Too Large');
                inputEl.value = '';
                return;
            }

            const docGroup = this.fb.group({
                file: [file, Validators.required],
                url: ['']
            });

            this.additionalDocs.push(docGroup);

            this._ApiRequestService.uploadDocument(file, 'additional').subscribe({
                next: (url: any) => {
                    docGroup.patchValue({ url });
                },
                error: () => {
                    this._NgxToasterService.showError(`${file.name} failed to upload`, 'Upload Error');
                    const index = this.additionalDocs.controls.indexOf(docGroup);
                    if (index > -1) this.additionalDocs.removeAt(index);
                }
            });
        }

        inputEl.value = '';
    }



    removeAdditionalDoc(index: number) {
        this.additionalDocs.removeAt(index);
    }

    handleUploadError(index: number, message: string) {
        this._NgxToasterService.showError(message, 'Upload Error');
        this.additionalDocs.removeAt(index);
    }
    // onFileSelect(event: any, index: number) {
    //     const file: File = event.target.files[0];
    //     const control = this.additionalDocs.at(index);

    //     if (file && file.size <= 5 * 1024 * 1024) {
    //         control.patchValue({ file });

    //         this._ApiRequestService.uploadDocument(file, 'additional').subscribe({
    //             next: (url: any) => {
    //                 if (url) {
    //                     control.patchValue({ url });
    //                     control.get('file')?.markAsTouched();
    //                 } else {
    //                     this.handleUploadError(index, 'Upload failed: No URL returned from server.');
    //                 }
    //             },
    //             error: (err) => {
    //                 const msg = err?.error?.message || 'Upload failed due to server error.';
    //                 this.handleUploadError(index, msg);
    //             }
    //         });
    //     } else {
    //         this._NgxToasterService.showError('File must be less than 5MB.', 'Error');
    //     }
    // }
    // handleUploadError(index: number, message: string) {
    //     this.additionalDocs.removeAt(index);
    //     if (this.additionalDocs.length === 0) {
    //         this.addAdditionalDoc();
    //     }
    // }


    onSubmit() {
        if (!this.agreementForm.valid || !this.agreementDocumentForm.valid) {
            this.agreementForm.markAllAsTouched();
            this.agreementDocumentForm.markAllAsTouched();
            this._NgxToasterService.showError('Please complete all required fields.', 'Error');
            return;
        }

        // Get uploaded additional docs
        const uploadedDocs = this.additionalDocs.controls
            .map(ctrl => ctrl.value)
            .filter(doc => !!doc.url);

        if (uploadedDocs.length === 0) {
            this._NgxToasterService.showError('Please upload at least one additional document.', 'Error');
            return;
        }
        const mainAgreementUrl = this.agreementDocumentForm.get('document_url')?.value;
        if (!mainAgreementUrl) {
            this._NgxToasterService.showError('Please upload the main agreement document.', 'Error');
            return;
        }

        // Build payload
        const payload = {
            id: 1,
            agreement_type: this.agreementForm.get('agreementType')?.value,
            additional_docs: uploadedDocs.map(doc => doc.url),
            agreement_details: this.agreementDocumentForm.value
        };

        console.log('Final Payload:', payload);
                 this._ApiRequestService.postData({ payload: payload }, apiRoutes.escrow.aggreement)
                    .subscribe({
                        next: (res: any) => {
                            if (res?.statuscode == 200) {
                                this._NgxToasterService.showSuccess(res.message, "Success");
                            } else {
                                 console.log("res",res)
                                this._NgxToasterService.showError(res?.message, "Error");
                            }
                        },
                        error: (error) => {
                            console.log("error",error)
                            const errorMsg = error?.error?.message || error?.message;
                            this._NgxToasterService.showError(errorMsg, 'Error');
                        }
                    });

    }



    openModal(content: any) {
        this.modalService.open(content, { centered: true, size: 'xl' });
    }

    // handleModalFile(event: any) {
    //     const file = event.target.files[0];

    //     if (file && file.size > 5 * 1024 * 1024) {
    //         this._NgxToasterService.showError('File must be less than 5MB', 'Error');
    //         return;
    //     }

    //     this._ApiRequestService.uploadDocument(file, 'agreement').subscribe({
    //         next: (url: any) => {
    //             if (url) {
    //                 console.log("url", url)
    //                 this.agreementDocumentForm.patchValue({ document_url: url });
    //                 this.agreementDocumentForm.get('documentUrl')?.markAsTouched();
    //             } else {
    //                 this.agreementDocumentForm.patchValue({ document_url: null });
    //             }
    //         },
    //         error: (err) => {
    //             this.agreementDocumentForm.patchValue({ document_url: null });
    //         }
    //     });
    // }
    handleModalFile(event: any) {
        const file = event.target.files[0];

        const allowedTypes = [
            'application/pdf',
            'image/png',
            'image/jpeg',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        if (!file) return;

        if (!allowedTypes.includes(file.type)) {
            this._NgxToasterService.showError('File type not allowed', 'Invalid File');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this._NgxToasterService.showError('File must be less than 5MB', 'Error');
            return;
        }

        this._ApiRequestService.uploadDocument(file, 'agreement').subscribe({
            next: (url: any) => {
                if (url) {
                    this.agreementDocumentForm.patchValue({ document_url: url });
                    this.agreementDocumentForm.get('document_url')?.markAsTouched();
                } else {
                    this.agreementDocumentForm.patchValue({ document_url: null });
                }
            },
            error: () => {
                this.agreementDocumentForm.patchValue({ document_url: null });
            }
        });
    }


    submitModal(modal: any) {
        console.log("this.agreementDocumentForm", this.agreementDocumentForm.value)
        const data = {
            agreementType: this.agreementForm.get('agreementType')?.value,
            ...this.agreementDocumentForm.value,
        };
        modal.close();
    }

}
