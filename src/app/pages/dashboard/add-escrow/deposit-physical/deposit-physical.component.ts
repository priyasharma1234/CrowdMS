import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { apiRoutes } from 'src/app/config/api-request';
import { CustomDatepickerComponent } from 'src/app/core/custom-datepicker/custom-datepicker.component';
import { CustConfg } from 'src/app/core/custom-datepicker/ngx-datePicker-CustConfg';
import { InputRestrictionDirective } from 'src/app/core/directives/InputRestriction/input-restriction.directive';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { EscrowService } from 'src/app/services/escrow.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-deposit-physical',
    imports: [SharedModule, CustomDatepickerComponent,
        BsDatepickerModule, InputRestrictionDirective],
    templateUrl: './deposit-physical.component.html',
    styleUrl: './deposit-physical.component.scss'
})
export class DepositPhysicalComponent implements OnInit {
    depositForm!: FormGroup;
    devices = ['Device A', 'Device B'];
    locations = ['Location A', 'Location B'];
    verificationOptions = ['KYC', 'PAN', 'Aadhar'];

    fileFields = [
        { controlName: 'device_picture', label: 'Upload Device Picture' },
        { controlName: 'packaging_picture', label: 'Upload Packaging Pic' },
        { controlName: 'other_picture', label: 'Upload Other Picture' },
        { controlName: 'other_documentation', label: 'Upload Other Documentation' }
    ];

    datepickerConfig = {
        container: 'body',
        containerClass: 'theme-blue'
    } as any;
    endMinScheduleDate!: Date;
    bsCustConfg = CustConfg;
    escrowId: any;
    selectedService: any;
    @Output() completed = new EventEmitter<void>();
    private fb = inject(FormBuilder);
    private _NgxToasterService = inject(NgxToasterService);
    private _ApiRequestService = inject(ApiRequestService);
    private _EscrowService = inject(EscrowService);
    ngOnInit(): void {
        const date = new Date();
        this.endMinScheduleDate = date;
        this._EscrowService.getEscrowId().subscribe((id: any) => {
            console.log("escrow", id)
            this.escrowId = id
        });
        this._EscrowService.getService().subscribe((serviceKey: any) => {
            if (serviceKey) {
                this.selectedService = serviceKey
            } else {
                this.selectedService = 'Physical'
            }

        });
        this.depositForm = this.fb.group({
            depositor_name: ['', Validators.required],
            depositor_mobile: ['', Validators.required],
            device: ['', Validators.required],
            submit_date: ['', Validators.required],
            primary_location: ['', Validators.required],
            vault_number: ['', Validators.required],
            kyc: ['', Validators.required],
            remarks: [''],
            device_picture: ['', Validators.required],
            packaging_picture: ['', Validators.required],
            other_picture: ['', Validators.required],
            other_documentation: ['', Validators.required]
        });
    }
    handleCommonFileUpload(event: Event, fileInput: HTMLInputElement, controlName: string): void {
        const file = (event.target as HTMLInputElement)?.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/png', 'image/jpeg'];
        if (!allowedTypes.includes(file.type)) {
            this._NgxToasterService.showError('Only PNG or JPEG allowed', 'Invalid File');
            this.depositForm.patchValue({ [controlName]: null });
            fileInput.value = '';
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this._NgxToasterService.showError('File must be less than 5MB', 'Error');
            this.depositForm.patchValue({ [controlName]: null });
            fileInput.value = '';
            return;
        }

        this._ApiRequestService.uploadDocument(file, 'deposit').subscribe({
            next: (url) => {
                this.depositForm.patchValue({ [controlName]: url });
                this.depositForm.get(controlName)?.markAsTouched();
            },
            error: (err) => {
                const msg = err?.error?.message || 'Upload failed';
                this._NgxToasterService.showError(msg, 'Error');
                this.depositForm.patchValue({ [controlName]: null });
                fileInput.value = '';
            }
        });
    }
    async submit() {
        this.depositForm.markAllAsTouched();
        if (this.depositForm.valid) {
            const formData = new FormData();
            const formValues = this.depositForm.getRawValue();
            Object.entries(formValues).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value ?? ''));
                }
            });
            formData.append('id', this.escrowId);
            formData.append('escrow_type', this.selectedService);
            await this._ApiRequestService.postData({ payload: formData }, apiRoutes.escrow.deposit)
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
}
