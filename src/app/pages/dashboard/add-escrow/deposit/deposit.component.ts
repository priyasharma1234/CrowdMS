import { Component, inject, OnInit } from '@angular/core';
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
    private _ApiRequestService = inject(ApiRequestService)
    constructor(private fb: FormBuilder) {
        this.depositForm = this.fb.group({
            primary_account: [{ value: 'AWS', disabled: true }, Validators.required],
            verification_type: [[], Validators.required],
            verification_for: ['', Validators.required],
            cert_usage: [[], Validators.required],
        });
    }

    async ngOnInit() {
        const response = await lastValueFrom(this._EscrowService.getDepositData());
        console.log("response", response);
        this.uploadOptions = response?.data?.uploadOptions || [];
        this.verificationOptions = response?.data?.verificationOptions || [];
        this.certificateOptions = response?.data?.certificateOptions || [];
        this.verificationFor = response?.data?.verificationFor || [];

    }

    toggleDocument(doc: string) {
        if (this.selectedDocuments.has(doc)) this.selectedDocuments.delete(doc);
        else this.selectedDocuments.add(doc);
    }

    toggleCertificate(cert: string) {
        if (this.selectedCertificates.has(cert)) this.selectedCertificates.delete(cert);
        else this.selectedCertificates.add(cert);
    }

    async submit() {
        if (this.depositForm.invalid) {
            this.depositForm.markAllAsTouched();
            return;
        }

        const payload = {
            id: 2,
            ...this.depositForm.getRawValue(),
            documents: Array.from(this.selectedDocuments),
            certificates: Array.from(this.selectedCertificates),
        };
        await this._ApiRequestService.postData({ payload: payload }, apiRoutes.escrow.deposit)
            .subscribe({
                next: (res: any) => {
                    if (res?.statuscode == 200) {
                        console.log("message")
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
}
