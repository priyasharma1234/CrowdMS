import { Component } from '@angular/core';
// import { EditEscrowService } from '../../../../../services/edit-escrow.service';
// import { IAgreement } from '../../../dashboard.types';
import { CommonModule } from '@angular/common';
import { IAgreement } from '../../edit-escrow-types';
import { EditEscrowService } from 'src/app/services/edit-escrow.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
    selector: 'app-view-agreement',
    imports: [CommonModule],
    templateUrl: './view-agreement.component.html',
    styleUrl: './view-agreement.component.scss'
})
export class ViewAgreementComponent {
    agreements: IAgreement | undefined;
    escrowId: any;
    constructor(
        private _EditEscrowService: EditEscrowService,
        public _FileUploadService: FileUploadService
    ) {
        this.agreements = this._EditEscrowService.escrowDetails?.agreement;
        this.escrowId = this._EditEscrowService.escrowDetails?.id
    }

}

