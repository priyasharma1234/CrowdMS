import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    constructor(private fb: FormBuilder) {
        this.depositForm = this.fb.group({
            primary_account: [{ value: 'AWS', disabled: true }, Validators.required],
            verification_type: [[], Validators.required],
            verification_for: ['', Validators.required],
            certificates_for: [[], Validators.required],
            documents: [[], Validators.required],
            certificates: [[], Validators.required]
        });
    }

    async ngOnInit() {
        const response = await lastValueFrom(this._EscrowService.getDepositData());
        console.log("response", response);
        this.uploadOptions = response?.data?.uploadOptions || [];
        this.verificationOptions = response?.data?.verificationOptions || [];
        this.certificateOptions = response?.data?.certificateOptions || [];
        this.verificationFor = response?.data?.verificationFor || [];
        this._EscrowService.getEscrowId().subscribe((id: any) => {
            console.log("escrow", id)
            this.escrowId = id
        });

    }

    // toggleDocument(doc: string) {
    //     if (this.selectedDocuments.has(doc)) this.selectedDocuments.delete(doc);
    //     else this.selectedDocuments.add(doc);
    // }

    // toggleCertificate(cert: string) {
    //     if (this.selectedCertificates.has(cert)) this.selectedCertificates.delete(cert);
    //     else this.selectedCertificates.add(cert);
    // }
    toggleDocument(doc: string) {
        if (this.selectedDocuments.has(doc)) {
            this.selectedDocuments.delete(doc);
        } else {
            this.selectedDocuments.add(doc);
        }
        this.depositForm.get('documents')?.setValue(Array.from(this.selectedDocuments));
        this.depositForm.get('documents')?.markAsTouched();
    }

    toggleCertificate(cert: string) {
        if (this.selectedCertificates.has(cert)) {
            this.selectedCertificates.delete(cert);
        } else {
            this.selectedCertificates.add(cert);
        }
        this.depositForm.get('certificates')?.setValue(Array.from(this.selectedCertificates));
        this.depositForm.get('certificates')?.markAsTouched();
    }

    async submit() {
        this.depositForm.markAllAsTouched();
        if (this.depositForm.valid) {
            // const payload = {
            //     id: this.escrowId,
            //     ...this.depositForm.getRawValue(),
            //     documents: Array.from(this.selectedDocuments),
            //     certificates: Array.from(this.selectedCertificates),
            const formData = new FormData();

            const formValues = this.depositForm.getRawValue();
            Object.entries(formValues).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value ?? ''));
                }
            });

            // formData.append('documents', JSON.stringify(Array.from(this.selectedDocuments)));
            // formData.append('certificates', JSON.stringify(Array.from(this.selectedCertificates)));

            // Append escrow ID
            formData.append('id', this.escrowId);

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
