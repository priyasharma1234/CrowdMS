import { Component, ElementRef, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CustomDatepickerComponent } from 'src/app/core/custom-datepicker/custom-datepicker.component';
import { CustConfg } from 'src/app/core/custom-datepicker/ngx-datePicker-CustConfg';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import { apiRoutes } from 'src/app/config/api-request';
import { EscrowService } from 'src/app/services/escrow.service';
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
    escrowId: any;
    @Output() completed = new EventEmitter<void>();
    private _EscrowService = inject(EscrowService);
    @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
    selectedService: any;
    private isFirstTimePatched = false;
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
        this._EscrowService.getService().subscribe((serviceKey: any) => {
            if (serviceKey) {
                this.selectedService = serviceKey
            } else {
                this.selectedService = 'Physical'
            }

        });

    }
    ngOnInit(): void {
        this._EscrowService.getEscrowId().subscribe((id: any) => {
            console.log("escrow", id)
            this.escrowId = id
        });
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

        // if (uploadedDocs.length === 0) {
        //     this._NgxToasterService.showError('Please upload at least one additional document.', 'Error');
        //     return;
        // }
        const mainAgreementUrl = this.agreementDocumentForm.get('document_url')?.value;
        if (!mainAgreementUrl) {
            this._NgxToasterService.showError('Please upload the main agreement document.', 'Error');
            return;
        }
        const formData = new FormData();
        formData.append('id', this.escrowId);
        formData.append('agreement_type', this.agreementForm.get('agreementType')?.value);
        const additionalDocs = uploadedDocs.map(doc => doc.url);
        formData.append('additional_docs', JSON.stringify(additionalDocs));
        formData.append('agreement_details', JSON.stringify(this.agreementDocumentForm.value));
        formData.append('escrow_type', this.selectedService);

        console.log('Final Payload:', formData);
        this._ApiRequestService.postData({ payload: formData }, apiRoutes.escrow.aggreement)
            .subscribe({
                next: (res: any) => {
                    if (res?.statuscode == 200) {
                        this.completed.emit();
                        this._NgxToasterService.showSuccess(res.message, "Success");
                    } else {
                        console.log("res", res)
                        this._NgxToasterService.showError(res?.message, "Error");
                    }
                },
                error: (error) => {
                    console.log("error", error)
                    const errorMsg = error?.error?.message || error?.message;
                    this._NgxToasterService.showError(errorMsg, 'Error');
                }
            });

    }
    openModal(content: any) {

        if (!this.isFirstTimePatched) {
            const today = new Date();
            const expiry = new Date();
            expiry.setFullYear(today.getFullYear() + 1);

            const form = this.agreementDocumentForm;

            if (
                !form.get('signing_date')?.value &&
                !form.get('effective_date')?.value &&
                !form.get('expiry_date')?.value
            ) {
                form.patchValue({
                    signing_date: today,
                    effective_date: today,
                    expiry_date: expiry
                });

                this.isFirstTimePatched = true;
            }
        }

        this.modalService.open(content, { centered: true, size: 'xl' });
    }

    handleModalFile(event: Event, fileInput: HTMLInputElement): void {
        const file = (event.target as HTMLInputElement)?.files?.[0];
        if (!file) return;

        const allowedTypes = [
            'application/pdf',
            'image/png',
            'image/jpeg',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        if (!allowedTypes.includes(file.type)) {
            this._NgxToasterService.showError('Only PNG or JPEG allowed', 'Invalid File');
            this.agreementDocumentForm.patchValue({ document_url: null });
            fileInput.value = '';
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this._NgxToasterService.showError('File must be less than 5MB', 'Error');
            this.agreementDocumentForm.patchValue({ document_url: null });
            fileInput.value = '';
            return;
        }

        this._ApiRequestService.uploadDocument(file, 'agreement').subscribe({
            next: (url) => {
                if (url) {
                    this.agreementDocumentForm.patchValue({ document_url: url });
                    this.agreementDocumentForm.get('document_url')?.markAsTouched();
                } else {
                    this.agreementDocumentForm.patchValue({ document_url: null });
                    fileInput.value = '';
                }
            },
            error: (err) => {
                this.agreementDocumentForm.patchValue({ document_url: null });
                fileInput.value = '';
                const errorMsg = err?.error?.message || err?.message || 'Upload failed';
                this._NgxToasterService.showError(errorMsg, 'Error');
            }
        });
    }
    clearModalDocument() {
        this.agreementDocumentForm.patchValue({ document_url: null });
        this.agreementDocumentForm.get('document_url')?.markAsTouched();
        if (this.fileInputRef?.nativeElement) {
            this.fileInputRef.nativeElement.value = '';
        }
    }

    submitModal(modal: any) {
        // console.log("this.agreementDocumentForm", this.agreementDocumentForm.value)
        // const data = {
        //     agreementType: this.agreementForm.get('agreementType')?.value,
        //     ...this.agreementDocumentForm.value,
        // };
        const formatDate = (date: Date | string): string => {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = ('0' + (d.getMonth() + 1)).slice(-2);
            const day = ('0' + d.getDate()).slice(-2);
            return `${year}/${month}/${day}`;
        };

        const formValue = this.agreementDocumentForm.value;

        const data = {
            agreementType: this.agreementForm.get('agreementType')?.value,
            signing_date: formatDate(formValue.signing_date),
            effective_date: formatDate(formValue.effective_date),
            expiry_date: formatDate(formValue.expiry_date),
            document_url: formValue.document_url
        };

        console.log('Final Submit Payload', data);
        modal.close();
    }

}
