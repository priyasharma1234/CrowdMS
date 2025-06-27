import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { apiRoutes } from 'src/app/config/api-request';
import { NgxToasterService } from 'src/app/core/services/toasterNgs.service';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { EscrowService } from 'src/app/services/escrow.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-release-condition',
    imports: [SharedModule],
    templateUrl: './release-condition.component.html',
    styleUrl: './release-condition.component.scss'
})
export class ReleaseConditionComponent implements OnInit {
    releaseForm!: FormGroup;
    customForm!: FormGroup;
    private _NgxToasterService = inject(NgxToasterService);
    private _ApiRequestService = inject(ApiRequestService);
    private fb = inject(FormBuilder);
    private modalService = inject(NgbModal);
    private router = inject(Router)
    @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
    selectedService: any;
    @Input() releaseData: any;
    private route = inject(ActivatedRoute)
    defaultOptions = [
        {
            key: 'bankruptcy',
            label: 'Bankruptcy',
            description: 'The software vendor or developer who deposits source code physically and related materials into escrow.',
            icon: 'assets/img/bankrup.png',
            isCustom: false,
        },
        {
            key: 'insolvency',
            label: 'Insolvency',
            description: 'The licensee or client who gains access to the escrowed materials if release conditions are triggered.',
            icon: 'assets/img/insolvency.png',
            isCustom: false,
        },
        {
            key: 'maintenance',
            label: 'Maintenance obligation not met',
            description: 'The software vendor or developer who deposits source code physically and related materials into escrow.',
            icon: 'assets/img/maintence.png',
            isCustom: false,
        }
    ];

    allOptions = [...this.defaultOptions];
    private _EscrowService = inject(EscrowService);
    escrowId: any;

    ngOnInit(): void {
        this.releaseForm = this.fb.group({
            release_conditions: [[], Validators.required],
            document: [null, Validators.required],
        });

        this.customForm = this.fb.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
        });
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
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            if (this.releaseData) {
                this.patchreleaseDetails()
            }
        }
    }
    patchreleaseDetails() {
        this.releaseForm.patchValue({
            release_conditions: this.releaseData?.release_conditions,
            document: this.releaseData?.document,
        })
    }

    isSelected(key: string): boolean {
        const selected = this.releaseForm.get('release_conditions')?.value || [];
        return selected.some((opt: any) => opt.key === key);
    }
    toggleOption(key: string) {
        const current = this.releaseForm.get('release_conditions')?.value || [];
        const existsIndex = current.findIndex((c: any) => c.key === key);

        if (existsIndex > -1) {
            current.splice(existsIndex, 1);
        } else {
            const fullOption = this.allOptions.find(opt => opt.key === key);
            if (fullOption) current.push(fullOption);
        }

        this.releaseForm.patchValue({ release_conditions: [...current] });
        this.releaseForm.get('release_conditions')?.markAsTouched();
    }


    openCustomModal(content: any): void {
        this.customForm.reset();
        this.modalService.open(content, { centered: true, backdrop: 'static', keyboard: false });
    }

    addCustom(modalRef: any): void {
        this.customForm.markAllAsTouched();
        if (this.customForm.valid) {
            const newCustom = {
                key: this.customForm.value.title.toLowerCase(),
                label: this.customForm.value.title,
                description: this.customForm.value.description,
                icon: 'assets/img/custom.png',
                isCustom: true
            };
            this.defaultOptions.push(newCustom);
            console.log("")
            this.allOptions = [...this.defaultOptions]
            modalRef.close();
        }

    }

    removeCustom(optionKey: string) {
        const index = this.allOptions.findIndex(opt => opt.key === optionKey && opt.isCustom);
        if (index !== -1) {
            this.allOptions.splice(index, 1);
        }

        const selected = this.releaseForm.get('release_conditions')?.value || [];
        this.releaseForm.patchValue({
            release_conditions: selected.filter((k: string) => k !== optionKey),
        });
    }
    cancelCustom(): void {
        this.customForm.reset();
    }

    onFileUpload(event: Event, fileInput: HTMLInputElement): void {
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
            this._NgxToasterService.showError('File type not allowed', 'Invalid File');
            this.releaseForm.patchValue({ document: null });
            fileInput.value = '';
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this._NgxToasterService.showError('File must be less than 5MB', 'Error');
            this.releaseForm.patchValue({ document: null });
            fileInput.value = '';
            return;
        }

        this._ApiRequestService.uploadDocument(file, 'releasecondition').subscribe({
            next: (url: string) => {
                if (url) {
                    this.releaseForm.patchValue({ document: url });
                    this.releaseForm.get('document')?.markAsTouched();
                } else {
                    this.releaseForm.patchValue({ document: null });
                    fileInput.value = '';
                }
            },
            error: (err) => {
                this.releaseForm.patchValue({ document: null });
                fileInput.value = '';
                const errorMsg = err?.error?.message || err?.message || 'Upload failed';
                this._NgxToasterService.showError(errorMsg, 'Error');
            }
        });
    }
    removeUploadedDocument() {
        this.releaseForm.patchValue({ document: null });
        if (this.fileInputRef?.nativeElement) {
            this.fileInputRef.nativeElement.value = '';
        }
    }

    async onSubmit() {
        this.releaseForm.markAllAsTouched();
        const formData = new FormData();
        formData.append('id', String(this.escrowId));
        formData.append('escrow_type', this.selectedService);
        const formValues = this.releaseForm.value;
        Object.entries(formValues).forEach(([key, value]) => {
            if (key === 'release_conditions' && Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, String(value ?? ''));
            }
        });
        if (this.releaseForm.valid) {
            await this._ApiRequestService.postData({ payload: formData }, apiRoutes.escrow.releaseCondition)
                .subscribe({
                    next: (res: any) => {
                        if (res?.statuscode == 200) {
                            this.router.navigate(['/dashboard']);
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
}