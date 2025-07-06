import { Component } from '@angular/core';
// import { EditEscrowService } from '../../../../../services/edit-escrow.service';
// import { IAgreement } from '../../../dashboard.types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-agreement',
  imports: [CommonModule],
  templateUrl: './view-agreement.component.html',
  styleUrl: './view-agreement.component.scss'
})
export class ViewAgreementComponent {
  agreements: any | undefined
  constructor(
    // private _EditEscrowService: EditEscrowService
  ) {
    // this.agreements = this._EditEscrowService.escrowDetails?.agreement;
  }


}
