import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../../../shared/shared.module';
import { InputRestrictionDirective } from '../../../../../core/directives/InputRestriction/input-restriction.directive';
import { apiRoutes } from '../../../../../config/api-request';
import { ApiRequestService } from '../../../../../services/api-request.service';
import { regExpPattern } from '../../../../../core/validators/regExpPatternList';
import { UppercaseDirective } from '../../../../../core/directives/uppercase/uppercase.directive';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import { EscrowService } from 'src/app/services/escrow.service';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-add-entity-modal',
    imports: [SharedModule, InputRestrictionDirective, UppercaseDirective],
    templateUrl: './add-entity-modal.component.html',
    styleUrl: './add-entity-modal.component.scss'
})
export class AddEntityModalComponent implements OnInit {
    @Input() entityType: 'depositor' | 'beneficiary' = 'depositor';
    form: FormGroup;
    typeList = [
        { value: 'new', name: "New" },
        { value: 'existing', name: "Existing" }
    ]
    escrowType: 'software' | 'physical';
    corporateList: any;
    @Input() entityData: any = null;
    constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private _ApiRequestService: ApiRequestService,
        private _NgxToasterService: NgxToasterService, private _EscrowService: EscrowService) {
        this._EscrowService.getService().subscribe((serviceKey: any) => {
            this.escrowType = serviceKey
        });
        this.form = this.fb.group({
            entity_type: ['', [Validators.required]],
            entity_id: [''],
            company_name: ['', [Validators.required]],
            company_pan: ['', [Validators.required]],
            company_cin: ['', [Validators.required]],
            company_address: ['', [Validators.required]],
            rep_name: ['', [Validators.required]],
            rep_email: ['', [Validators.required, Validators.pattern(regExpPattern['email'])]],
            rep_mobile: ['', [Validators.required]],
            rep_alt_mobile: [''],
            rep_profile_pic: [null, Validators.required],
            remark: ['', [Validators.required]],
        });

    }
    async ngOnInit() {
        const response = await lastValueFrom(this._EscrowService.getCorporateList());
        this.corporateList = response?.data?.list || [];
        this.form.get('entity_type')?.valueChanges.subscribe((typeValue) => {
            const entityIdControl = this.form.get('entity_id');
            if (typeValue == 'existing') {
                entityIdControl?.setValidators([Validators.required]);
            } else {
                this.form.patchValue({
                    entity_id: '',
                    company_name: '',
                    company_pan: '',
                    company_cin: '',
                    company_address: '',
                    rep_name: '',
                    rep_email: '',
                    rep_mobile: '',
                    rep_alt_mobile: '',
                    rep_profile_pic: '',
                    remark: ''
                });
                entityIdControl?.clearValidators();
                entityIdControl?.setValue('');
            }

            entityIdControl?.updateValueAndValidity();
        });
        this.form.get('entity_id')?.valueChanges.subscribe((entityId) => {
            const selectedCorp = this.corporateList.find((corp: any) => corp.id === entityId);
            if (selectedCorp) {
                this.form.patchValue({
                    company_name: selectedCorp.company_name,
                    company_pan: selectedCorp.company_pan,
                    company_cin: selectedCorp.company_cin,
                    company_address: selectedCorp.company_address,
                    rep_name: selectedCorp.rep_name,
                    rep_email: selectedCorp.rep_email,
                    rep_mobile: selectedCorp.rep_mobile,
                    rep_alt_mobile: selectedCorp.rep_alt_mobile,
                    rep_profile_pic: selectedCorp.rep_profile_pic,
                    remark: selectedCorp.remark,
                });
            }
        });

        // In case of edit
        if (this.entityData) {
            this.form.patchValue(this.entityData);
        }
    }

    submit() {
        this.form.markAllAsTouched();
        console.log(" this.entityType", this.entityType)
        if (this.form?.valid) {
            const data = {
                ...this.form.getRawValue(),
                corporate_type: this.entityType == 'depositor' ? '1' : this.entityType == 'beneficiary' ? '2' : '',
                escrow_type: this.escrowType
                // ...(this.editable && this.editId ? { id: this.editId } : {})
            };
            this._ApiRequestService.postData({ payload: data }, apiRoutes.escrow.createDepositorOrBene)
                .subscribe({
                    next: (res: any) => {
                        if (res?.statuscode == 200) {
                            if (this.entityType == 'depositor') {
                                this._EscrowService.setDepositorId(res.user_id);
                            } else if (this.entityType == 'beneficiary') {
                                this._EscrowService.setBeneId(res.user_id);
                            }
                            this._NgxToasterService.showSuccess(res.message, "Success");
                            this.activeModal.close(this.form.value);
                        } else {
                            this._NgxToasterService.showError(res?.message, "Error");
                        }
                    },
                    error: (error) => {
                        const errorMsg = error?.error?.message || error?.message;
                        this._NgxToasterService.showError(errorMsg, 'Error');
                    }
                });
        }
    }
    get typeRequiredMessage() {
        return `${this.entityType?.charAt(0).toUpperCase() + this.entityType?.slice(1)} Type is Required`;
    }
    get entityRequiredMessage() {
        return `${this.entityType?.charAt(0).toUpperCase() + this.entityType?.slice(1)} is Required`;
    }
    onPhotoSelected(event: Event): void {
        const file = (event.target as HTMLInputElement)?.files?.[0];
        if (!file) return;
        this._ApiRequestService.uploadDocument(file, this.entityType).subscribe({
            next: (url) => {
                this.form.patchValue({ rep_profile_pic: url });
                this.form.get('rep_profile_pic')?.markAsTouched();
            },
            error: (err) => {
                console.error('Upload failed', err);
            }
        });
    }
    clearRepPhoto() {
        this.form.patchValue({ rep_profile_pic: null });
        this.form.get('rep_profile_pic')?.markAsTouched();
    }
}