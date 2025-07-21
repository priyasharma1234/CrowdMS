import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { apiRoutes } from 'src/app/config/api-request';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { EscrowService } from 'src/app/services/escrow.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-deposit',
    imports: [SharedModule],
    templateUrl: './deposit.component.html',
    styleUrl: './deposit.component.scss'
})
export class DepositComponent implements OnInit {
    depositForm!: FormGroup;
    primaryAccounts = ['AWS'];
    uploadOptions: Array<any> = [];
    verificationOptions: Array<any> = [];
    certificateOptions: Array<any> = [];
    verificationFor: Array<any> = [];
    selectedDocuments = new Set<string>();
    selectedCertificates = new Set<string>();
    private _EscrowService = inject(EscrowService);
    private _NgxToasterService = inject(NgxToasterService);
    private _ApiRequestService = inject(ApiRequestService);
    escrowId: any;
    @Output() completed = new EventEmitter<void>();
    selectedService: any;
    @Input() depositData: any;
    isnoneSelected: boolean = false;
    private route = inject(ActivatedRoute);
    constructor(private fb: FormBuilder) {
        this.depositForm = this.fb.group({
            primary_account: [{ value: 'AWS', disabled: true }, Validators.required],
            verification_type: [[], Validators.required],
            verification_for: [''],
            certificates_for: [''],
            documents: [[]],
            certificates: [[]]
        });
    }

    async ngOnInit() {
        const response = await lastValueFrom(this._EscrowService.getDepositData());
        console.log("response", response);
        this.uploadOptions = response?.data?.uploadOptions || [];
        this.verificationOptions = (response?.data?.verificationOptions || []).map((opt: any) => ({
            ...opt,
            disabled: false
        }));
        this.certificateOptions = response?.data?.certificateOptions || [];
        this.verificationFor = response?.data?.verificationFor || [];
        this._EscrowService.getEscrowId().subscribe((id: any) => {
            console.log("escrow", id)
            this.escrowId = id
        });
        this._EscrowService.getService().subscribe((serviceKey: any) => {
            if (serviceKey) {
                this.selectedService = serviceKey
            }
        });
        this.depositForm.get('verification_type')?.valueChanges.subscribe((selected: string[]) => {
            const ctrl = this.depositForm.get('verification_type');
            const verificationForCtrl = this.depositForm.get('verification_for');

            const isNoneSelected = selected?.includes('None');

            if (isNoneSelected && selected.length > 1) {
                ctrl?.setValue(['None'], { emitEvent: false });
            }

            this.verificationOptions = this.verificationOptions.map(opt => {
                return {
                    ...opt,
                    disabled: isNoneSelected ? opt.id !== 'None' : false
                };
            });
            if (isNoneSelected) {
                this.isnoneSelected = false;
                verificationForCtrl?.clearValidators();
                verificationForCtrl?.updateValueAndValidity();
            } else {
                 this.isnoneSelected = true;
                verificationForCtrl?.setValidators(Validators.required);
                verificationForCtrl?.updateValueAndValidity();
            }

        });
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            if (this.depositData) {
                this.patchdepositDetails()
            }
        }

    }
    patchdepositDetails() {
        const { documents = [], certificates = [] } = this.depositData || {};
        this.selectedDocuments = new Set(documents);
        this.selectedCertificates = new Set(certificates);

        this.depositForm.patchValue({
            primary_account: this.depositData?.primary_account,
            verification_type: this.depositData?.verification_type,
            verification_for: this.depositData?.verification_for,
            certificates_for: this.depositData?.certificates_for,
            documents: documents,
            certificates: certificates,
        });

    }
    toggleDocument(doc: string) {
        if (this.selectedDocuments.has(doc)) {
            this.selectedDocuments.delete(doc);
        } else {
            this.selectedDocuments.add(doc);
        }
        this.depositForm.get('documents')?.setValue(Array.from(this.selectedDocuments));
        this.depositForm.get('documents')?.markAsTouched();
    }

    // toggleCertificate(cert: string) {
    //     if (this.selectedCertificates.has(cert)) {
    //         this.selectedCertificates.delete(cert);
    //     } else {
    //         this.selectedCertificates.add(cert);
    //     }
    //     this.depositForm.get('certificates')?.setValue(Array.from(this.selectedCertificates));
    //     this.depositForm.get('certificates')?.markAsTouched();
    // }
    toggleCertificate(cert: string) {
        if (this.selectedCertificates.has(cert)) {
            this.selectedCertificates.delete(cert);
        } else {
            this.selectedCertificates.add(cert);
        }

        const selected = Array.from(this.selectedCertificates);
        this.depositForm.get('certificates')?.setValue(selected);
        this.depositForm.get('certificates')?.markAsTouched();

        const certsForCtrl = this.depositForm.get('certificates_for');

        if (selected.length > 0) {
            certsForCtrl?.setValidators(Validators.required);
        } else {
            certsForCtrl?.clearValidators();
            certsForCtrl?.setValue(null);
        }

        certsForCtrl?.updateValueAndValidity();
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

            // };
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
