import { NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { apiRoutes } from 'src/app/config/api-request';
import { ApiRequestService } from 'src/app/services/api-request.service';
import { EditEscrowService } from 'src/app/services/edit-escrow.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-view-edit-release',
  imports: [ NgIf,NgForOf,ReactiveFormsModule,FormsModule ],
  templateUrl: './view-edit-release.component.html',
  styleUrl: './view-edit-release.component.scss'
})
export class ViewEditReleaseComponent {
 releaseForm: FormGroup;
  selectedCondition: string | null = 'Bankruptcy';
  uploadedFile: File | null = null;

  conditions:any;
  protected fileUrl: string | undefined;
  remarks: any;

  constructor(
    private _FormBuilder: FormBuilder,
    private _ApiRequestService: ApiRequestService,
    private _EditEscrowService: EditEscrowService,
    private _FileUploadService: FileUploadService,
    private _ActiveModal: NgbActiveModal,
  ) {
    this.conditions  = []
    // this.conditions = JSON.parse(JSON.parse(this._EditEscrowService.escrowDetails?.release.reason ?? '[]'));
    // console.log('Conditions:', this.conditions);
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
