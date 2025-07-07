import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {ApiRequestService} from '../../../../../../services/api-request.service';
import {EditEscrowService} from '../../../../../../services/edit-escrow.service';
import {FileUploadService} from '../../../../../../services/file-upload.service';
import {apiRoutes} from '../../../../../../config/api-request';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-release-request',
  imports: [
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './add-release-request.component.html',
  styleUrl: './add-release-request.component.scss',
  standalone: true
})
export class AddReleaseRequestComponent {
  releaseForm: FormGroup;
  selectedCondition: string | null = 'Bankruptcy';
  uploadedFile: File | null = null;

  conditions;
  protected fileUrl: string | undefined;
  remarks: any;

  constructor(
    private _FormBuilder: FormBuilder,
    private _ApiRequestService: ApiRequestService,
    private _EditEscrowService: EditEscrowService,
    private _FileUploadService: FileUploadService,
    private _ActiveModal: NgbActiveModal,
  ) {
    this.conditions = JSON.parse(JSON.parse(this._EditEscrowService.escrowDetails?.release.reason ?? '[]'));
    console.log('Conditions:', this.conditions);
    this.releaseForm = this._FormBuilder.group({
      remarks: ['']
    });
  }

  selectCondition(label: string): void {
    this.selectedCondition = label;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this._FileUploadService.uploadDocument(input.files[0], 'release-request').subscribe({
        next: (fileUrl: string) => {
          this.fileUrl = fileUrl;
        },
        error: (err: Error) => {
          console.error('File upload failed:', err);
        }
      });
    } else {
      this.uploadedFile = null;
      console.log('No file selected');
    }
  }

  submit(): void {
    const escrowDetails = this._EditEscrowService.escrowDetails;
    const payload = {
      escrow_id: escrowDetails?.id,
      reason: this.selectedCondition,
      remarks: this.remarks,
      document: this.fileUrl
    };
    this._ApiRequestService.postData({payload: payload}, apiRoutes.escrow.submitReleaseRequest).subscribe({
      next: (res: any) => {
        if (res?.statuscode === 200) {
          this._ActiveModal.close();
          console.log('Release request submitted successfully:', res);
          // Handle success, e.g., close modal or show success message
        } else {
          console.error('Error submitting release request:', res?.message);
          // Handle error, e.g., show error message
        }
      },
      error: (error: any) => {
        console.error('Error submitting release request:', error);
        // Handle network or server error
      }
    });


    console.log('Release Request:', payload);
    // Submit to backend or emit event
  }

  cancel(): void {
    // Close modal logic here
  }
}
