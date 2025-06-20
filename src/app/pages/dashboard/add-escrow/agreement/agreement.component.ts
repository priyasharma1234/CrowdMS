import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CustomDatepickerComponent } from 'src/app/core/custom-datepicker/custom-datepicker.component';
import { CustConfg } from 'src/app/core/custom-datepicker/ngx-datePicker-CustConfg';
// import { CustomDatepickerComponent } from '@core/custom-datepicker/custom-datepicker.component';
// import { CustConfg } from '@core/custom-datepicker/ngx-datePicker-CustConfg';

@Component({
    selector: 'app-agreement',
    imports: [SharedModule, CustomDatepickerComponent,BsDatepickerModule],
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
    additionalDocsFiles: File[] = [];
    selectedFile: File | null = null;
    fileError: string = '';

    constructor(private fb: FormBuilder, private modalService: NgbModal) {
        const date = new Date();
        this.endMinScheduleDate = date;
        this.agreementForm = this.fb.group({
            agreementType: [''],
        });
        this.agreementDocumentForm = this.fb.group({
            signingDate: ['', Validators.required],
            effectiveDate: ['', Validators.required],
            expiryDate: ['', Validators.required],
        });

    }
    ngOnInit(): void {

    }

    onFileChange(event: any, type: 'mainAgreement' | 'additionalDocs') {
        const files = event.target.files;

        if (type === 'additionalDocs') {
            this.additionalDocsFiles = Array.from(files);
        }
    }

    onSubmit() {
        console.log('Form Data:', this.agreementForm.value);
        console.log('Additional Docs Files:', this.additionalDocsFiles);

        // Handle form submission and file upload logic here...
    }


    openModal(content: any) {
        this.modalService.open(content, { centered: true, size: 'xl' });
    }

    handleModalFile(event: any) {
        const file = event.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) {
            this.fileError = 'File must be less than 5MB.';
            this.selectedFile = null;
        } else {
            this.selectedFile = file;
            this.fileError = '';
        }
    }

    submitModal(modal: any) {
        const data = {
            agreementType: this.agreementForm.get('agreementType')?.value,
            ...this.agreementDocumentForm.value,
            document: this.selectedFile
        };
        console.log('Submitted Data:', data);
        // Save or process as needed...
        modal.close();
    }

}
