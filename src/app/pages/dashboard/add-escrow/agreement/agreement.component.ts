import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
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
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FileUploadService } from 'src/app/services/file-upload.service';
// import { CustomDatepickerComponent } from '@core/custom-datepicker/custom-datepicker.component';
// import { CustConfg } from '@core/custom-datepicker/ngx-datePicker-CustConfg';

@Component({
    selector: 'app-agreement',
    imports: [SharedModule, CustomDatepickerComponent, BsDatepickerModule],
    templateUrl: './agreement.component.html',
    styleUrl: './agreement.component.scss'
})
export class AgreementComponent implements OnInit {
    @ViewChild('content') contentTemplate!: TemplateRef<any>;
    @Output() formInstance = new EventEmitter<FormGroup>();
    datepickerConfig = {
        container: 'body',
        containerClass: 'theme-blue'
    } as any;
    endMinScheduleDate!: Date;
    endMinDateMonthAgo!: Date;
    bsCustConfg = CustConfg;
    agreementForm: FormGroup;
    agreementDocumentForm: FormGroup;
    escrowId: any;
    @Output() completed = new EventEmitter<void>();
    private _EscrowService = inject(EscrowService);
    @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
    @Input() agreementData: any
    selectedService: any;
    formData: any;
    private route = inject(ActivatedRoute);
  endMaxDateMonthForward!: Date;
    constructor(private fb: FormBuilder, private modalService: NgbModal, private _ApiRequestService: ApiRequestService,
        private _NgxToasterService: NgxToasterService, private _DatePipe: DatePipe, public _FileUploadService: FileUploadService) {
        const date = new Date();
        this.endMinScheduleDate = date;
        this.agreementForm = this.fb.group({
            agreement_type: [''],
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
            }

        });

    }
    ngOnInit(): void {
        this._EscrowService.getEscrowId().subscribe((id: any) => {
            console.log("escrow", id)
            this.escrowId = id
        });
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);

        this.endMinDateMonthAgo = oneMonthAgo;

        const oneMonthForward = new Date();
        oneMonthForward.setMonth(today.getMonth() + 1);
        this.endMaxDateMonthForward = oneMonthForward;

        const id = this.route.snapshot.paramMap.get('id');
        console.log("idddddddddd", id)
        console.log("this.agreementData)", this.agreementData)
        if (id) {
            if (this.agreementData) {
                this.patchAgreementDetails()
            }
        }
        this.formInstance.emit(this.agreementForm);
    }
    patchAgreementDetails() {
        this.agreementForm.patchValue({
            agreement_type: this.agreementData?.agreement_type
        })
        this.additionalDocs.clear();

        const additionalDocs: string[] = this.agreementData?.additional_docs || [];

        // if (additionalDocs.length > 0) {
        //     additionalDocs.forEach((docUrl: string) => {
        //         if (docUrl) {
        //             const docGroup = this.fb.group({
        //                 file: [null],
        //                 url: [docUrl, Validators.required]
        //             });
        //             this.additionalDocs.push(docGroup);
        //         }
        //     });
        // }
        if (additionalDocs.length > 0) {
            additionalDocs.forEach((docObj: any, index: number) => {
                if (docObj?.url) {
                    const docGroup = this.fb.group({
                        file: [null],
                        url: [docObj.url],
                        doc_name: [docObj.file_name]
                    });
                    this.additionalDocs.push(docGroup);
                }
            });
        }
        this.formData = {
            signing_date: this.agreementData?.signing_date,
            effective_date: this.agreementData?.effective_date,
            expiry_date: this.agreementData?.expiry_date,
            document_url: this.agreementData?.document_url
        }
    }
    get additionalDocs(): FormArray {
        return this.agreementForm.get('additional_docs') as FormArray;
    }

    createDocumentGroup(file: File): FormGroup {
        return this.fb.group({
            file: [file],
            url: [''],
            doc_name: [file.name]
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

            if (file.size > 15 * 1024 * 1024) {
                this._NgxToasterService.showError(`${file.name} exceeds 15MB`, 'File Too Large');
                inputEl.value = '';
                return;
            }

            const docGroup = this.fb.group({
                file: [file, Validators.required],
                url: [''],
                doc_name: [file.name]
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
        this.agreementForm.markAllAsTouched();
        this.agreementDocumentForm.markAllAsTouched();
        if (this.agreementData) {
            this.agreementDocumentForm.patchValue({
                signing_date: this.formData?.signing_date,
                effective_date: this.formData?.effective_date,
                expiry_date: this.formData?.expiry_date,
                document_url: this.formData?.document_url
            });
        } else {
            this.agreementDocumentForm.patchValue({
                signing_date: this._DatePipe.transform(this.formData?.signing_date, 'dd-MM-yyyy'),
                effective_date: this._DatePipe.transform(this.formData?.effective_date, 'dd-MM-yyyy'),
                expiry_date: this._DatePipe.transform(this.formData?.expiry_date, 'dd-MM-yyyy'),
                document_url: this.formData?.document_url
            });
        }
        if (this.agreementForm.valid && this.agreementDocumentForm.valid) {
            // if (!this.agreementForm.valid && !this.agreementDocumentForm.valid) {
            //     this.agreementForm.markAllAsTouched();
            //     this.agreementDocumentForm.markAllAsTouched();
            //     this._NgxToasterService.showError('Please complete all required fields.', 'Error');
            //     return;
            // }


            for (const [index, ctrl] of this.additionalDocs.controls.entries()) {
                const docName = ctrl.get('doc_name')?.value;
                const url = ctrl.get('url')?.value;

                if (!url || !docName?.trim()) {
                    this._NgxToasterService.showError(`Please provide both file and name for Document ${index + 1}.`, 'Validation Error');
                    return;
                }
            }

            const additionalDocs = this.additionalDocs.controls
                .filter(ctrl => !!ctrl.get('url')?.value)
                .map(ctrl => ({
                    url: ctrl.get('url')?.value,
                    file_name: ctrl.get('doc_name')?.value
                }));

            const mainAgreementUrl = this.agreementDocumentForm.get('document_url')?.value;
            if (!mainAgreementUrl) {
                this._NgxToasterService.showError('Please upload the main agreement document.', 'Error');
                return;
            }
            const formData = new FormData();
            formData.append('id', this.escrowId);
            formData.append('agreement_type', this.agreementForm.get('agreement_type')?.value);
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


    }
    openModal(content: any) {
        const form = this.agreementDocumentForm;
        console.log("agreementData", this.agreementData);
        console.log("form", form)
          console.log("!form.get('signing_date')?.value",!form.get('signing_date')?.value);
          console.log(" && !form.get('effective_date')?.value", !form.get('effective_date')?.value)
          console.log("!form.get('expiry_date')?.value ",  !form.get('expiry_date')?.value , !this.agreementData , !this.formData)
        console.log("!form.get('signing_date')?.value && !form.get('effective_date')?.value && !form.get('expiry_date')?.value && !this.agreementData && !this.formData",!form.get('signing_date')?.value && !form.get('effective_date')?.value && !form.get('expiry_date')?.value && !this.agreementData && !this.formData)
        if (!form.get('signing_date')?.value && !form.get('effective_date')?.value && !form.get('expiry_date')?.value && !this.agreementData && !this.formData) {
            const today = new Date();
            const expiry = new Date();
            expiry.setFullYear(today.getFullYear() + 1);

            form.patchValue({
                signing_date: today,
                effective_date: today,
                expiry_date: expiry
            });
        } else {
            console.log("this.formData111", this.formData);
            if (this.agreementData) {
                this.agreementDocumentForm.patchValue({
                    signing_date: this.formData?.signing_date,
                    effective_date: this.formData?.effective_date,
                    expiry_date: this.formData?.expiry_date,
                    document_url: this.formData?.document_url
                });
            } else {
                console.log("this.formData?.document_url", this.formData?.document_url)
                this.agreementDocumentForm.patchValue({
                    signing_date: this._DatePipe.transform(this.formData?.signing_date, 'dd-MM-yyyy'),
                    effective_date: this._DatePipe.transform(this.formData?.effective_date, 'dd-MM-yyyy'),
                    expiry_date: this._DatePipe.transform(this.formData?.expiry_date, 'dd-MM-yyyy'),
                    document_url: this.formData?.document_url
                });
            }

        }



        this.modalService.open(content, { centered: true, size: 'lg' });
    }
    closeModal(){
        this.modalService.dismissAll();
         this.agreementDocumentForm.reset();
        }

    onAgreementTypeChange(event: any) {
        const selectedType = event.target.value;
          this.agreementDocumentForm.reset();
        // this.openModal(this.contentTemplate);
    }

    handleModalFile(event: Event, fileInput: HTMLInputElement): void {
        const file = (event.target as HTMLInputElement)?.files?.[0];
        if (!file) return;

        const allowedTypes = [
            'application/pdf'
            // ,
            // 'image/png',
            // 'image/jpeg',
            // 'application/msword',
            // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        if (!allowedTypes.includes(file.type)) {
            this._NgxToasterService.showError('Only Pdf allowed', 'Invalid File');
            this.agreementDocumentForm.patchValue({ document_url: null });
            fileInput.value = '';
            return;
        }

        if (file.size > 15 * 1024 * 1024) {
            this._NgxToasterService.showError('File must be less than 15MB', 'Error');
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
        console.log("this.agreementDocumentForm", this.agreementDocumentForm.value)
        this.agreementDocumentForm.markAllAsTouched();
        if (this.agreementDocumentForm.valid) {
            const data = {
                agreement_type: this.agreementForm.get('agreement_type')?.value,
                ...this.agreementDocumentForm.value,
            };
            this.formData = data;
            this.agreementDocumentForm.reset();
            modal.close();
        }

    }

}
