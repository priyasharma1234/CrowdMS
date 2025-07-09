import { Component } from '@angular/core';
// import { EditEscrowService } from '../../../../../services/edit-escrow.service';
// import { IAgreement } from '../../../dashboard.types';
import { CommonModule } from '@angular/common';
import { IAgreement } from '../../edit-escrow-types';
import { EditEscrowService } from 'src/app/services/edit-escrow.service';

@Component({
    selector: 'app-view-agreement',
    imports: [CommonModule],
    templateUrl: './view-agreement.component.html',
    styleUrl: './view-agreement.component.scss'
})
export class ViewAgreementComponent {
    agreements: IAgreement | undefined
    constructor(
        private _EditEscrowService: EditEscrowService
    ) {
        this.agreements = this._EditEscrowService.escrowDetails?.agreement;
        console.log("agreements111111",this.agreements)
    }
    openInNewTab(url: any) {
        if (url) {
            window.open(url, '_blank');
        }
    }

}

