import {NgForOf, NgIf} from '@angular/common';
import {Component, Input} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {apiRoutes} from 'src/app/config/api-request';
import {NgxToasterService} from 'src/app/core/services/toasterNgs.service';
import {ShowErrorsComponent} from 'src/app/features/show-errors/show-errors.component';
import {ApiRequestService} from 'src/app/services/api-request.service';
import {FileUploadService} from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-request-action',
  standalone: true,
  imports: [NgIf, NgForOf, ReactiveFormsModule, FormsModule, ShowErrorsComponent],
  templateUrl: './request-action.component.html',
  styleUrl: './request-action.component.scss'
})
export class RequestActionComponent {
  heading = '';
  releaseForm: FormGroup;
  uploadedFile: File | null = null;
  fileUrl: string | undefined;
  remarks: string = '';
  selectedRequestValue: string | null = null;
  selectedRequestType: number | null = null;
  selectedRequestStatus: number | null = null;
  @Input() escrowId: string
  escrow: any;
  requestStagesTypes = [
    {label: 'Validation - Depositor', value: 'AWAITING_DEPOSIT'},
    {label: 'Validation - Beneficiary', value: 'AWAITING_REVIEW'}
  ];
  viewMode: boolean = false;
  requestTypes = [
        { label: 'Approve', value: 1 },
        { label: 'Reject', value: 0 }
    ];
  constructor(
    private fb: FormBuilder,
    private _ApiRequestService: ApiRequestService,
    private _NgxToasterService: NgxToasterService,
    private _FileUploadService: FileUploadService,
    public activeModal: NgbActiveModal
  ) {
    this.releaseForm = this.fb.group({
      remarks: ['', [Validators.required]]
    });
  }


  submit(): void {
    this.releaseForm.markAllAsTouched();
    if (this.selectedRequestStatus === null) {
      this._NgxToasterService.showError("Please select release request", 'Error');
      return
    }
        if (this.selectedRequestType === null) {
            this._NgxToasterService.showError("Please select release request", 'Error');
            return
        }
    if (this.releaseForm.valid) {
      let payload: {
        id: string;
        status: number;
        remarks: string;
        type: string;
        stage?: string;
      } = {
        id: this.escrowId,
        // status: this.selectedRequestStatus,
        status:  this.selectedRequestType,
        remarks: this.releaseForm.get('remarks')?.value || '',
        type: this.escrow.request_type
      };
     
      if (this.selectedRequestValue) {
        payload.stage = this.selectedRequestValue;
      }
      console.log(this.selectedRequestValue)

      this._ApiRequestService.postData({payload}, apiRoutes.requests.takeAction).subscribe({
        next: (res) => {
          if (res?.statuscode === 200) {
            this.activeModal.close();
          } else {
            this._NgxToasterService.showError(res?.message, 'Error');
          }
        },
        error: (error) => {
          const errorMsg = error?.error?.message || error?.message;
          this._NgxToasterService.showError(errorMsg, 'Error');
        }
      });
    }

  }
      selectRequestType(type: { label: string, value: number }): void {
        this.selectedRequestType = type.value;
    }
}
