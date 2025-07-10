import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
    escrowType: 'Software' | 'Physical';
    corporateList: any;
    @Input() entityData: any = null;
    @Input() editId: any = null;
    depositorId: any;
    beneId: any;
    constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private _ApiRequestService: ApiRequestService,
        private _NgxToasterService: NgxToasterService, private _EscrowService: EscrowService) {
        this._EscrowService.getService().subscribe((serviceKey: any) => {
            this.escrowType = serviceKey
        });
        this._EscrowService.getDepositorId().subscribe((id: any) => {
            console.log("deposit", id)
            this.depositorId = id
        });
        this._EscrowService.getBeneId().subscribe((id: any) => {
            console.log("beneId", id)
            this.beneId = id;
        });
        this.form = this.fb.group({
            entity_type: ['', [Validators.required]],
            corpid: [''],
            company_name: ['', [Validators.required]],
            corporate_identifier: ['', [Validators.required]],
            user_identifier: ['', [Validators.required]],
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
        this.form.get('entity_type')?.enable();
        const response = await lastValueFrom(this._EscrowService.getCorporateList());
        this.corporateList = response?.data?.list || [];
        this.form.get('entity_type')?.valueChanges.subscribe((typeValue) => {
            const entityIdControl = this.form.get('corpid');
            if (typeValue == 'existing') {
                entityIdControl?.setValidators([Validators.required]);
            } else {
                this.form.patchValue({
                    corpid: '',
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
        this.form.get('corpid')?.valueChanges.subscribe((entityId) => {
            const selectedCorp = this.corporateList.find((corp: any) => corp.id === entityId);
            if (selectedCorp) {
                this.form.patchValue({
                    company_name: selectedCorp.company_name,
                    company_pan: selectedCorp.corporate_details.company_pan,
                    company_cin: selectedCorp.corporate_details.company_cin,
                    corporate_identifier: selectedCorp.corporate_identifier,
                    user_identifier: selectedCorp.master_user.username,
                    company_address: selectedCorp.corporate_details.company_address,
                    rep_name: selectedCorp.corporate_details.rep_name,
                    rep_email: selectedCorp.corporate_details.rep_email,
                    rep_mobile: selectedCorp.corporate_details.rep_mobile,
                    rep_alt_mobile: selectedCorp.corporate_details.rep_alt_mobile,
                    rep_profile_pic: selectedCorp.corporate_details.rep_profile_pic,
                    remark: selectedCorp.corporate_details.remark,
                });
            }
        });

        // In case of edit
        if (this.entityData) {
            console.log("this.entityData",this.entityData)
            this.form.patchValue(this.entityData);
            this.form.get('entity_type')?.disable();
        }

    }

    submit() {
        this.form.markAllAsTouched();
        console.log(" this.entityType", this.entityType)
        if (this.form?.valid) {
            // const data = {
            //     ...this.form.getRawValue(),
            //     corporate_type: this.entityType == 'depositor' ? '1' : this.entityType == 'beneficiary' ? '2' : '',
            //     escrow_type: this.escrowType,
            //     ...(this.editId ? { id: this.editId } : {}),
            //     submit_type: this.editId ? 'update' : 'create'
            // };
            const formData = new FormData();

            Object.keys(this.form.controls).forEach((key) => {
                const control = this.form.get(key);
                const value = control?.value;

                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            formData.append('corporate_type', this.entityType === 'depositor' ? '1' : '2');
            formData.append('escrow_type', this.escrowType);
            formData.append('submit_type', this.editId ? 'update' : 'create');
            formData.append('username', this.form.get('user_identifier')?.value || '');

            if (this.editId) {
                formData.append('id', this.editId);
            }
            // const apiUrl = this.editId
            //     ? apiRoutes.escrow.updateDepositorOrBene

            //     : apiRoutes.escrow.createDepositorOrBene;
            this._ApiRequestService.postData({ payload: formData }, apiRoutes.escrow.submitCorporate)
                .subscribe({
                    next: (res: any) => {
                        if (res?.statuscode == 200) {
                            console.log("this.entityType", this.entityType)
                            if (this.entityType == 'depositor') {
                                this._EscrowService.setDepositorId(res?.data?.corpid);
                                this.activeModal.dismiss()
                            } else if (this.entityType == 'beneficiary') {
                                this._EscrowService.setBeneId(res?.data?.corpid);
                                this.activeModal.dismiss()
                            }
                            this._NgxToasterService.showSuccess(res.message, "Success");

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
    onPhotoSelected(event: Event, fileInput: HTMLInputElement): void {
        const file = (event.target as HTMLInputElement)?.files?.[0];
        if (!file) return;

        this._ApiRequestService.uploadDocument(file, this.entityType).subscribe({
            next: (url) => {
                if (url) {
                    this.form.patchValue({ rep_profile_pic: url });
                    this.form.get('rep_profile_pic')?.markAsTouched();
                } else {
                    this.form.patchValue({ rep_profile_pic: null });
                    fileInput.value = '';
                }
            },
            error: (err) => {
                this.form.patchValue({ rep_profile_pic: null });
                fileInput.value = '';
                const errorMsg = err?.error?.message || err?.message;
                this._NgxToasterService.showError(errorMsg, 'Error');
            }
        });
    }
    clearRepPhoto() {
        this.form.patchValue({ rep_profile_pic: null });
        this.form.get('rep_profile_pic')?.markAsTouched();
    }
}
