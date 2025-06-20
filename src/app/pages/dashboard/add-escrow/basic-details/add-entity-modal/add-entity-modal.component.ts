import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../../../shared/shared.module';
import { InputRestrictionDirective } from '../../../../../core/directives/InputRestriction/input-restriction.directive';
import { apiRoutes } from '../../../../../config/api-request';
import { ApiRequestService } from '../../../../../services/api-request.service';
import { regExpPattern } from '../../../../../core/validators/regExpPatternList';
import { UppercaseDirective } from '../../../../../core/directives/uppercase/uppercase.directive';

@Component({
    selector: 'app-add-entity-modal',
    imports: [SharedModule, InputRestrictionDirective, UppercaseDirective],
    templateUrl: './add-entity-modal.component.html',
    styleUrl: './add-entity-modal.component.scss'
})
export class AddEntityModalComponent implements OnInit {
    @Input() entityType: 'Depositor' | 'Beneficiary' = 'Depositor';
    form: FormGroup;
    typeList = [
        { value: 'new', name: "New" },
        { value: 'existing', name: "Existing" }
    ]
    constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private _ApiRequestService: ApiRequestService) {
        this.form = this.fb.group({
            type: ['', [Validators.required]],
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
    ngOnInit(): void {
        this.form.get('type')?.valueChanges.subscribe((typeValue) => {
            const entityIdControl = this.form.get('entity_id');
            if (typeValue === 'existing') {
                entityIdControl?.setValidators([Validators.required]);
            } else {
                entityIdControl?.clearValidators();
                entityIdControl?.setValue('');
            }

            entityIdControl?.updateValueAndValidity();
        });
    }

    submit() {
        // this.form.markAllAsTouched();
        // if (this.form.valid) {
        //     console.log(`${this.entityType} Data:`, this.form.value);
        //      this._ApiRequestService.postData({}, apiRoutes.escrow.createDepositorOrBene).subscribe((res) =>{
        //                     this.activeModal.close(this.form.value);
        //      });
        // }
        this.form.markAllAsTouched();
        if (this.form?.valid) {
            const data = {
                ...this.form.value,
                // ...(this.editable && this.editId ? { id: this.editId } : {})
            };

            this._ApiRequestService.postData({ payload: data }, apiRoutes.escrow.createDepositorOrBene)
                .subscribe({
                    next: (res: any) => {
                        if (res?.statuscode === 200) {
                            // this._NgxToasterService.showSuccess(res.message, "Success");
                            this.activeModal.close(this.form.value);
                        } else {
                            // this._NgxToasterService.showError(res?.message, "Error");
                        }
                    },
                    error: (error) => {
                        const errorMsg = error?.error?.message || error?.message;
                        // this._NgxToasterService.showError(errorMsg, 'Error');
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
}